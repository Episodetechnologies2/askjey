"use client";

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Trash,
  Plus,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import api from '@/lib/adminApi';

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export default function WorkForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get('/categories', { params: { module: 'work' } });
        setCategories(response.data);
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    }
    loadCategories();
  }, []);

  // Form State
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      year: '2026',
      client: '',
      role: '',
      location: '',
      duration: '',
      industry: '',
      short_description: '',
      long_description: '',
      featured_image: '',
      hero_image: '',
      status: 'draft',
      is_top_work: false,
      seo_title: '',
      seo_description: '',
      display_order: 0
    }
  });

  const watchTitle = watch('title');

  // JSON Lists State
  const [services, setServices] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [results, setResults] = useState([]);
  const [tags, setTags] = useState([]);

  // Story (slides) State
  const [story, setStory] = useState([]);

  // Gallery (array of urls) State
  const [gallery, setGallery] = useState([]);

  // Auto-slugify
  useEffect(() => {
    if (!isEdit && watchTitle) {
      setValue('slug', slugify(watchTitle));
    }
  }, [watchTitle, setValue, isEdit]);

  // Load existing work details
  useEffect(() => {
    if (isEdit) {
      async function loadWork() {
        try {
          const response = await api.get(`/works/${id}`);
          const work = response.data;

          // Set standard fields
          Object.keys(work).forEach(key => {
            if (key === 'services' || key === 'technologies' || key === 'results' || key === 'tags' || key === 'story') {
              // Parse JSON columns if returned as strings
              let parsedVal = work[key];
              if (typeof parsedVal === 'string') {
                try {
                  parsedVal = JSON.parse(parsedVal);
                } catch (e) { }
              }
              if (key === 'services') setServices(parsedVal || []);
              if (key === 'technologies') setTechnologies(parsedVal || []);
              if (key === 'results') setResults(parsedVal || []);
              if (key === 'tags') setTags(parsedVal || []);
              if (key === 'story') setStory(parsedVal || []);
            } else {
              setValue(key, work[key] !== null ? work[key] : '');
            }
          });

          // Set is_top_work boolean
          setValue('is_top_work', !!work.is_top_work);

          // Set gallery state
          setGallery(work.gallery || []);

        } catch (error) {
          console.error('Failed to load work details:', error);
          toast.error('Failed to retrieve work data.');
          router.push('/admin/works');
        } finally {
          setFetching(false);
        }
      }
      loadWork();
    }
  }, [id, isEdit, setValue, router]);

  // Handle direct file uploads inside form
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const uploadToast = toast.loading('Uploading and compressing image...');
    try {
      const response = await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { url } = response.data;

      if (fieldName === 'featured_image' || fieldName === 'hero_image') {
        setValue(fieldName, url);
      } else if (fieldName === 'gallery') {
        setGallery([...gallery, url]);
      } else if (fieldName.startsWith('story_image_')) {
        const idx = parseInt(fieldName.split('story_image_')[1]);
        updateStorySlide(idx, 'image', url);
      }

      toast.success('Image uploaded successfully!', { id: uploadToast });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed.', { id: uploadToast });
    }
  };

  // Tag helper component actions
  const handleAddTag = (list, setList, val) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
  };

  const handleRemoveTag = (list, setList, idx) => {
    setList(list.filter((_, i) => i !== idx));
  };

  // Story slides helper actions
  const addStorySlide = () => {
    setStory([...story, { image: '', title: '', text: '' }]);
  };

  const removeStorySlide = (idx) => {
    setStory(story.filter((_, i) => i !== idx));
  };

  const updateStorySlide = (idx, field, value) => {
    const updated = [...story];
    updated[idx][field] = value;
    setStory(updated);
  };

  const moveStorySlide = (idx, direction) => {
    const updated = [...story];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= story.length) return;

    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setStory(updated);
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      services,
      technologies,
      results,
      tags,
      story,
      gallery
    };

    try {
      if (isEdit) {
        await api.put(`/work/${id}`, payload);
        toast.success('Work updated successfully!');
      } else {
        await api.post('/work', payload);
        toast.success('Work created successfully!');
      }
      router.push('/admin/works');
    } catch (error) {
      console.error('Save work error:', error);
      const errMsg = error.response?.data?.error || 'Failed to save portfolio work.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-white/40">Fetching Work Data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/works"
            className="p-2 rounded-lg border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.02] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-4xl uppercase tracking-wider font-bold">
              {isEdit ? 'Edit Portfolio Case' : 'New Portfolio Case'}
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
              Configure metrics, details, and galleries
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-xs px-5 py-3.5 rounded-full flex items-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(30,188,199,0.3)] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
          <span>{isEdit ? 'Update Case Study' : 'Save Case Study'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CORE INPUTS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. HappyLabs Agency"
                  className={`w-full bg-black/20 border ${errors.title ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]`}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-500 text-[10px] font-bold">{errors.title.message}</p>}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Unique Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. happylabs-agency"
                  className={`w-full bg-black/20 border ${errors.slug ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]`}
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && <p className="text-red-500 text-[10px] font-bold">{errors.slug.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Sector / Category *</label>
                <select
                  className={`w-full bg-black/20 border ${errors.category ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] cursor-pointer`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Project Year *</label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  {...register('year')}
                />
              </div>

              {/* Client */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Client Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. SUGUNA Foods"
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  {...register('client')}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Admin Role / Position</label>
                <input
                  type="text"
                  placeholder="e.g. Creative Partner / Lead Architect"
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  {...register('role')}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Project Location</label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore, India"
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  {...register('location')}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 6 Months / Ongoing"
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  {...register('duration')}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Short Showcase Text (Snippet) *</label>
              <input
                type="text"
                placeholder="Where design met strategy and bold ideas grew."
                className={`w-full bg-black/20 border ${errors.short_description ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]`}
                {...register('short_description', { required: 'Short description is required' })}
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Full Case Description</label>
              <textarea
                rows={5}
                placeholder="Write full text details about the inception, roadmap, and outcomes..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                {...register('long_description')}
              />
            </div>
          </div>

          {/* Section 2: Case Details (Services, Technologies, Results, Tags) */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Project Deliverables & Tags</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Services Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Services Provided</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="serviceInput"
                    placeholder="Press Enter or Add button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(services, setServices, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('serviceInput');
                      handleAddTag(services, setServices, input.value);
                      input.value = '';
                    }}
                    className="px-3 bg-white/5 hover:bg-[#1ebcc7]/15 rounded-xl border border-white/5 text-xs text-[#1ebcc7] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {services.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1ebcc7]/10 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-wider">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveTag(services, setServices, idx)} className="text-red-500 hover:text-red-400 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Technologies Used</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="techInput"
                    placeholder="Figma, AWS, React..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(technologies, setTechnologies, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('techInput');
                      handleAddTag(technologies, setTechnologies, input.value);
                      input.value = '';
                    }}
                    className="px-3 bg-white/5 hover:bg-[#1ebcc7]/15 rounded-xl border border-white/5 text-xs text-[#1ebcc7] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {technologies.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1ebcc7]/10 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-wider">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveTag(technologies, setTechnologies, idx)} className="text-red-500 hover:text-red-400 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Results Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Impact Results</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="resultInput"
                    placeholder="e.g. Serving over 100+ brands"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(results, setResults, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('resultInput');
                      handleAddTag(results, setResults, input.value);
                      input.value = '';
                    }}
                    className="px-3 bg-white/5 hover:bg-[#1ebcc7]/15 rounded-xl border border-white/5 text-xs text-[#1ebcc7] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {results.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1ebcc7]/10 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-wider">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveTag(results, setResults, idx)} className="text-red-500 hover:text-red-400 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Search Keywords / Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="tagInput"
                    placeholder="Branding, Agency, SaaS..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tags, setTags, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('tagInput');
                      handleAddTag(tags, setTags, input.value);
                      input.value = '';
                    }}
                    className="px-3 bg-white/5 hover:bg-[#1ebcc7]/15 rounded-xl border border-white/5 text-xs text-[#1ebcc7] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1ebcc7]/10 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-wider">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveTag(tags, setTags, idx)} className="text-red-500 hover:text-red-400 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Story Slides */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Case Presentation Slides (Story)</h3>
              <button
                type="button"
                onClick={addStorySlide}
                className="px-3 py-1.5 rounded-lg border border-[#1ebcc7]/30 bg-[#1ebcc7]/5 text-[#1ebcc7] hover:bg-[#1ebcc7]/15 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {story.map((slide, idx) => (
                <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl relative space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1ebcc7]">Slide #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => moveStorySlide(idx, 'up')} disabled={idx === 0} className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => moveStorySlide(idx, 'down')} disabled={idx === story.length - 1} className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => removeStorySlide(idx)} className="p-1 text-red-500 hover:text-red-400 cursor-pointer">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
                    {/* Image */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Slide Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.pexels.com/..."
                        className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-[11px] focus:outline-none"
                        value={slide.image}
                        onChange={(e) => updateStorySlide(idx, 'image', e.target.value)}
                      />
                      <label className="flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded-lg hover:border-[#1ebcc7]/30 text-white/60 hover:text-white cursor-pointer justify-center text-[10px] uppercase font-bold bg-white/[0.01]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, `story_image_${idx}`)}
                        />
                      </label>
                    </div>

                    {/* Title and Text */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Slide Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Creative Direction & Branding"
                          className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none"
                          value={slide.title}
                          onChange={(e) => updateStorySlide(idx, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Slide Text Paragraph</label>
                        <textarea
                          rows={3}
                          placeholder="We crafted the visual identity system establishing a bold, strategic presence..."
                          className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none"
                          value={slide.text}
                          onChange={(e) => updateStorySlide(idx, 'text', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {story.length === 0 && (
                <p className="text-center py-6 text-white/20 text-xs font-semibold uppercase tracking-wider">No case slides added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MEDIAS & STATUS */}
        <div className="space-y-6">
          {/* Settings & Publish Box */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-5">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Publish Settings</h3>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Status</label>
              <select
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('status')}
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live Website)</option>
              </select>
            </div>

            {/* Top Work Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/80">Featured Top Work</label>
                <p className="text-[10px] text-white/30 font-semibold mt-0.5">Show in horizontal scrolling timeline</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('is_top_work')}
                />
                <div className="w-11 h-6 bg-black/35 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 peer-checked:after:bg-[#1ebcc7] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ebcc7]/15 peer-checked:border-[#1ebcc7]/30 border border-white/10"></div>
              </label>
            </div>

            {/* Display Order */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Display Order index</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('display_order')}
              />
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-5">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Case Images</h3>

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Featured Image URL *</label>
              <input
                type="text"
                placeholder="https://images.pexels.com/..."
                className={`w-full bg-black/20 border ${errors.featured_image ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none`}
                {...register('featured_image', { required: 'Featured image is required' })}
              />
              <label className="flex items-center gap-1.5 px-3 py-2.5 border border-white/10 rounded-xl hover:border-[#1ebcc7]/30 text-white/60 hover:text-white cursor-pointer justify-center text-[10px] uppercase font-bold bg-white/[0.01]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Featured Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'featured_image')}
                />
              </label>
              {watch('featured_image') && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 mt-2 bg-black/40">
                  <img src={watch('featured_image')} alt="Featured Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Hero Image URL</label>
              <input
                type="text"
                placeholder="https://images.pexels.com/..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('hero_image')}
              />
              <label className="flex items-center gap-1.5 px-3 py-2.5 border border-white/10 rounded-xl hover:border-[#1ebcc7]/30 text-white/60 hover:text-white cursor-pointer justify-center text-[10px] uppercase font-bold bg-white/[0.01]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Hero Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'hero_image')}
                />
              </label>
              {watch('hero_image') && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 mt-2 bg-black/40">
                  <img src={watch('hero_image')} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Multiple Gallery Images */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Case Gallery</h3>
              <label className="px-3 py-1.5 rounded-lg border border-[#1ebcc7]/30 bg-[#1ebcc7]/5 text-[#1ebcc7] hover:bg-[#1ebcc7]/15 text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {gallery.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/5 bg-black/40">
                  <img src={url} alt={`Gallery #${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1.5 rounded bg-black/60 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="col-span-2 text-center py-6 text-white/20 text-xs font-semibold uppercase tracking-wider">No gallery images added.</p>
              )}
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">SEO Metadata</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">SEO Title</label>
              <input
                type="text"
                placeholder="Meta title tag..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('seo_title')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">SEO Description</label>
              <textarea
                rows={3}
                placeholder="Meta description tags..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('seo_description')}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

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
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import api from '@/lib/adminApi';

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export default function UpdateForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Form hooks
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      author: 'Jey Anand',
      short_description: '',
      thumbnail: '',
      banner: '',
      status: 'draft',
      published_date: '',
      seo_title: '',
      seo_description: ''
    }
  });

  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get('/categories', { params: { module: 'update' } });
        setCategories(response.data);
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    }
    loadCategories();
  }, []);

  const watchTitle = watch('title');

  // Multi-value list states
  const [tags, setTags] = useState([]);
  const [keyTakeaways, setKeyTakeaways] = useState([]);
  // body description array of paragraphs
  const [paragraphs, setParagraphs] = useState(['']);

  // Auto slugify
  useEffect(() => {
    if (!isEdit && watchTitle) {
      setValue('slug', slugify(watchTitle));
    }
  }, [watchTitle, setValue, isEdit]);

  // Load existing article
  useEffect(() => {
    if (isEdit) {
      async function loadUpdate() {
        try {
          const response = await api.get(`/updates/${id}`);
          const article = response.data;

          Object.keys(article).forEach(key => {
            if (key === 'tags' || key === 'key_takeaways' || key === 'description') {
              let parsedVal = article[key];
              if (typeof parsedVal === 'string') {
                try {
                  parsedVal = JSON.parse(parsedVal);
                } catch (e) { }
              }
              if (key === 'tags') setTags(parsedVal || []);
              if (key === 'key_takeaways') setKeyTakeaways(parsedVal || []);
              if (key === 'description') setParagraphs(parsedVal || ['']);
            } else {
              setValue(key, article[key] !== null ? article[key] : '');
            }
          });

        } catch (error) {
          console.error('Failed to load article details:', error);
          toast.error('Failed to retrieve article details.');
          router.push('/admin/updates');
        } finally {
          setFetching(false);
        }
      }
      loadUpdate();
    }
  }, [id, isEdit, setValue, router]);

  // Handle direct upload inside form
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
      setValue(fieldName, url);
      toast.success('Image uploaded successfully!', { id: uploadToast });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed.', { id: uploadToast });
    }
  };

  // Tag list helpers
  const handleAddTag = (list, setList, val) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
  };

  const handleRemoveTag = (list, setList, idx) => {
    setList(list.filter((_, i) => i !== idx));
  };

  // Paragraph list helpers
  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (idx) => {
    if (paragraphs.length <= 1) {
      setParagraphs(['']);
      return;
    }
    setParagraphs(paragraphs.filter((_, i) => i !== idx));
  };

  const updateParagraph = (idx, value) => {
    const updated = [...paragraphs];
    updated[idx] = value;
    setParagraphs(updated);
  };

  const moveParagraph = (idx, direction) => {
    const updated = [...paragraphs];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= paragraphs.length) return;

    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setParagraphs(updated);
  };

  // Submit Form
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      description: paragraphs, // send array of paragraphs
      tags,
      key_takeaways: keyTakeaways
    };

    try {
      if (isEdit) {
        await api.put(`/update/${id}`, payload);
        toast.success('Article updated successfully!');
      } else {
        await api.post('/update', payload);
        toast.success('Article created successfully!');
      }
      router.push('/admin/updates');
    } catch (error) {
      console.error('Save update error:', error);
      const errMsg = error.response?.data?.error || 'Failed to save update article.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-white/40">Fetching Article Data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/updates"
            className="p-2 rounded-lg border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.02] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-4xl uppercase tracking-wider font-bold">
              {isEdit ? 'Edit Article Update' : 'New Article Update'}
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
              Configure body paragraphs, category tags and publish dates
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-xs px-5 py-3.5 rounded-full flex items-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(30,188,199,0.3)] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
          <span>{isEdit ? 'Update Article' : 'Publish Article'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: BODY & EXCERPT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Core Content */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Article Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Building Brands in the Age of Noise"
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
                  placeholder="e.g. building-brands-in-age-of-noise"
                  className={`w-full bg-black/20 border ${errors.slug ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]`}
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && <p className="text-red-500 text-[10px] font-bold">{errors.slug.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Category Category *</label>
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
            </div>

            {/* Short Description (Excerpt) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Excerpt / Short Description *</label>
              <textarea
                rows={3}
                placeholder="Silence is the new luxury. How to create brands that whisper instead of shouting..."
                className={`w-full bg-black/20 border ${errors.short_description ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]`}
                {...register('short_description', { required: 'Short description is required' })}
              />
              {errors.short_description && <p className="text-red-500 text-[10px] font-bold">{errors.short_description.message}</p>}
            </div>
          </div>

          {/* Section 2: Body Paragraphs (Array List) */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Body Content (Paragraphs)</h3>
              <button
                type="button"
                onClick={addParagraph}
                className="px-3 py-1.5 rounded-lg border border-[#1ebcc7]/30 bg-[#1ebcc7]/5 text-[#1ebcc7] hover:bg-[#1ebcc7]/15 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Add Paragraph
              </button>
            </div>

            <div className="space-y-4">
              {paragraphs.map((para, idx) => (
                <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl space-y-2 relative">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Paragraph #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => moveParagraph(idx, 'up')} disabled={idx === 0} className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => moveParagraph(idx, 'down')} disabled={idx === paragraphs.length - 1} className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeParagraph(idx)} className="p-1 text-red-500 hover:text-red-400 cursor-pointer">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder={`Enter text block for paragraph #${idx + 1}...`}
                    className="w-full bg-transparent border-0 rounded-lg p-1 text-xs focus:outline-none focus:ring-0 font-body leading-relaxed text-white/95"
                    value={para}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TAXONOMY & ASSETS */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-5">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Publish Settings</h3>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Status</label>
              <select
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none cursor-pointer"
                {...register('status')}
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live Website)</option>
              </select>
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Author Name</label>
              <input
                type="text"
                placeholder="e.g. Jey Anand"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('author')}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Published Date Text</label>
              <input
                type="text"
                placeholder="e.g. Feb 18, 2026"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('published_date')}
              />
              <p className="text-[8px] text-white/30 uppercase tracking-widest font-semibold px-1">Preserve format seen on live site</p>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-5">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Assets</h3>

            {/* Thumbnail Image */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Thumbnail Image URL *</label>
              <input
                type="text"
                placeholder="https://images.pexels.com/..."
                className={`w-full bg-black/20 border ${errors.thumbnail ? 'border-red-500/50' : 'border-white/5'} rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none`}
                {...register('thumbnail', { required: 'Thumbnail image URL is required' })}
              />
              <label className="flex items-center gap-1.5 px-3 py-2.5 border border-white/10 rounded-xl hover:border-[#1ebcc7]/30 text-white/60 hover:text-white cursor-pointer justify-center text-[10px] uppercase font-bold bg-white/[0.01]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                />
              </label>
              {watch('thumbnail') && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 mt-2 bg-black/40">
                  <img src={watch('thumbnail')} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Banner Image URL</label>
              <input
                type="text"
                placeholder="https://images.pexels.com/..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('banner')}
              />
              <label className="flex items-center gap-1.5 px-3 py-2.5 border border-white/10 rounded-xl hover:border-[#1ebcc7]/30 text-white/60 hover:text-white cursor-pointer justify-center text-[10px] uppercase font-bold bg-white/[0.01]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'banner')}
                />
              </label>
              {watch('banner') && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 mt-2 bg-black/40">
                  <img src={watch('banner')} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Tags & Key Takeaways */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-6">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">Metadata Tags</h3>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Key Takeaways List</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="takeawayInput"
                  placeholder="e.g. Silence is a signal"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(keyTakeaways, setKeyTakeaways, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('takeawayInput');
                    handleAddTag(keyTakeaways, setKeyTakeaways, input.value);
                    input.value = '';
                  }}
                  className="px-3 bg-white/5 hover:bg-[#1ebcc7]/15 rounded-xl border border-white/5 text-xs text-[#1ebcc7] font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {keyTakeaways.map((item, idx) => (
                  <span key={idx} className="flex justify-between items-start gap-3 p-2 rounded bg-black/20 border border-white/5 text-xs text-white/80">
                    <span className="leading-relaxed">{item}</span>
                    <button type="button" onClick={() => handleRemoveTag(keyTakeaways, setKeyTakeaways, idx)} className="text-red-500 hover:text-red-400 font-bold shrink-0">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Article Keywords / Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="tagInput"
                  placeholder="Branding, Strategy..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tags, setTags, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
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

          {/* SEO Info */}
          <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider font-bold text-[#1ebcc7]">SEO Optimization</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">SEO Title</label>
              <input
                type="text"
                placeholder="Meta title override tag..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none"
                {...register('seo_title')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">SEO Description</label>
              <textarea
                rows={3}
                placeholder="Meta description summary..."
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

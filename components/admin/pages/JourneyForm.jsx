"use client";

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Loader2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import api from '@/lib/adminApi';

export default function JourneyForm() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    shortDescription: '',
    longDescription: '',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  });

  // Fetch milestone if in edit mode
  useEffect(() => {
    if (isEdit) {
      async function loadMilestone() {
        setFetching(true);
        try {
          const response = await api.get(`/journey/${id}`);
          const data = response.data;
          setFormData({
            year: data.year ? String(data.year) : '',
            title: data.title || '',
            shortDescription: data.shortDescription || data.short_description || '',
            longDescription: data.longDescription || data.long_description || '',
            image: data.image || ''
          });
        } catch (error) {
          toast.error('Failed to load journey milestone details');
          router.push('/admin/journey');
        } finally {
          setFetching(false);
        }
      }
      loadMilestone();
    }
  }, [id, isEdit, router]);

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    const uploadToast = toast.loading('Uploading milestone image...');
    try {
      const response = await api.post('/media', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { url } = response.data;
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully!', { id: uploadToast });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.year.trim() || !formData.title.trim() || !formData.shortDescription.trim()) {
      toast.error('Please fill in Year, Milestone Title, and Short Description.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/journey/${id}`, formData);
        toast.success('Journey milestone updated successfully!');
      } else {
        await api.post('/journey', formData);
        toast.success('New journey milestone created successfully!');
      }
      router.push('/admin/journey');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || 'Failed to save milestone');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm('Are you sure you want to delete this journey milestone?')) return;

    setLoading(true);
    try {
      await api.delete(`/journey/${id}`);
      toast.success('Journey milestone deleted');
      router.push('/admin/journey');
    } catch (error) {
      toast.error('Failed to delete milestone');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1ebcc7] mb-2" />
        <p className="text-xs text-white/50 uppercase tracking-widest">Loading Milestone Details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/journey"
            className="p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-[#1ebcc7]/40 hover:bg-[#1ebcc7]/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider font-bold text-white">
              {isEdit ? 'Edit Journey Milestone' : 'Create Journey Milestone'}
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
              "The Chronicles of Jey Anand" Timeline Record
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 text-red-400 hover:text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <Link
            href="/admin/journey"
            className="px-5 py-3 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center gap-2 bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(30,188,199,0.3)] hover:shadow-[0_0_30px_rgba(30,188,199,0.5)] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEdit ? 'Save Changes' : 'Create Milestone'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Core Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171717]/60 border border-white/10 rounded-[24px] p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-display uppercase tracking-wider text-white/80 font-bold border-b border-white/10 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1ebcc7]" />
              <span>Milestone Details</span>
            </h3>

            {/* Title & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/60">
                  Milestone Title <span className="text-[#1ebcc7]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rockstar Entrepreneur's Journey Starts"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/60">
                  Year <span className="text-[#1ebcc7]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all font-mono"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/60">
                Short Description / Subtitle <span className="text-[#1ebcc7]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary displayed on timeline cards..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] p-4 text-sm text-white focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all leading-relaxed"
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/60">
                Detailed / Extended Narrative
              </label>
              <textarea
                rows={6}
                placeholder="Full story or extended narrative describing this milestone..."
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] p-4 text-sm text-white focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Media & Order Sidebar */}
        <div className="space-y-6">
          
          {/* Milestone Image Card */}
          <div className="bg-[#171717]/60 border border-white/10 rounded-[24px] p-6 space-y-5">
            <h3 className="text-sm font-display uppercase tracking-wider text-white/80 font-bold border-b border-white/10 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1ebcc7]" />
              <span>Milestone Image</span>
            </h3>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-white/15 hover:border-[#1ebcc7]/50 rounded-[16px] p-6 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-all relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[#1ebcc7]" />
                ) : (
                  <Upload className="w-8 h-8 text-[#1ebcc7]" />
                )}
                <p className="text-xs font-semibold text-white/90">
                  {uploading ? 'Uploading Image...' : 'Click or Drag & Drop Image File'}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  PNG, JPG, WEBP or GIF supported
                </p>
              </div>
            </div>

            {/* Manual URL Input */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/40">
                Or Image Path / URL
              </label>
              <input
                type="text"
                placeholder="e.g. /Journey/2026_1.png or https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1ebcc7]"
              />
            </div>

            {/* Image Preview Box */}
            {formData.image && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Live Preview</span>
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-video group">
                  <img
                    src={formData.image}
                    alt="Milestone Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500/90 text-black font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Loaded</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Automatic Year Ordering Card */}
          <div className="bg-[#171717]/60 border border-white/10 rounded-[24px] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#1ebcc7]">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-display uppercase tracking-wider font-bold">
                Automatic Year Sorting
              </h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Milestones are automatically sorted chronologically by <strong className="text-white">Year</strong> across both the website timeline and admin list. No manual ordering index needed!
            </p>
          </div>

        </div>

      </div>
    </form>
  );
}

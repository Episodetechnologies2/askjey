"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
;
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import api from '@/lib/adminApi';
import CategoryManagementModal from '../CategoryManagementModal';

export default function UpdatesList() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', {
        params: { module: 'update' }
      });
      setCategories(response.data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/updates', {
        params: {
          search,
          category,
          status,
          page,
          limit: 1000
        }
      });
      setUpdates(response.data.updates);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
      toast.error('Could not load updates list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [search, category, status, page]);

  // Select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(updates.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk status update
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await api.post('/updates/bulk-status', { ids: selectedIds, status: newStatus });
      toast.success(`Selected updates set to ${newStatus}`);
      setSelectedIds([]);
      fetchUpdates();
    } catch (e) {
      toast.error('Bulk update failed.');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected articles?`)) return;

    try {
      await api.post('/updates/bulk-delete', { ids: selectedIds });
      toast.success('Selected updates deleted successfully');
      setSelectedIds([]);
      fetchUpdates();
    } catch (e) {
      toast.error('Bulk deletion failed.');
    }
  };

  // Delete single article
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/update/${id}`);
      toast.success(`Deleted article: ${title}`);
      fetchUpdates();
    } catch (e) {
      toast.error('Deletion failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider font-bold">Website Updates</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Manage articles, logs, and announcements</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="bg-transparent hover:bg-white/5 border border-white/10 hover:border-[#1ebcc7]/30 text-white font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all"
          >
            Manage Update Categories
          </button>
          <Link href="/admin/updates/new"
            className="bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-full flex items-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(30,188,199,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write Update</span>
          </Link>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by article title, excerpt..."
            className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          <select
            className="bg-[#171717] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] cursor-pointer"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            className="bg-[#171717] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] cursor-pointer"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* BULK ACTIONS BOX */}
      {selectedIds.length > 0 && (
        <div className="bg-[#171717]/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4 animate-fade-in-up">
          <span className="text-xs font-semibold text-[#1ebcc7] uppercase tracking-wider pl-2">
            {selectedIds.length} Articles Selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-green-500/20 transition-all"
            >
              Bulk Publish
            </button>
            <button
              onClick={() => handleBulkStatus('draft')}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-amber-500/20 transition-all"
            >
              Bulk Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-red-500/20 transition-all"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1ebcc7]" />
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Retrieving website updates...</p>
          </div>
        ) : updates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/10 text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                  <th className="py-4 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.02] text-[#1ebcc7] focus:ring-[#1ebcc7]"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === updates.length && updates.length > 0}
                    />
                  </th>
                  <th className="py-4 px-4">Title / Excerpt</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Author / Date</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-semibold">
                {updates.map((update) => (
                  <tr key={update.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/20 bg-white/[0.02] text-[#1ebcc7] focus:ring-[#1ebcc7]"
                        checked={selectedIds.includes(update.id)}
                        onChange={() => handleSelectOne(update.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={update.thumbnail || 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?w=100'}
                          alt={update.title}
                          className="w-10 h-10 rounded-lg object-cover bg-black/20"
                        />
                        <div>
                          <p className="text-white hover:text-[#1ebcc7] transition-colors truncate max-w-[260px]">{update.title}</p>
                          <p className="text-[10px] text-white/30 font-semibold truncate max-w-[260px]">/{update.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      <span className="px-2 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1ebcc7]">
                        {update.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      <p className="text-xs">{update.author}</p>
                      <p className="text-[10px] text-white/30 font-semibold">{update.published_date}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {update.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-bold uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <a
                          href={`https://www.askjey.in/blogs/${update.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-white hover:border-white/10 transition-all"
                          title="Preview live"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <Link href={`/admin/updates/edit/${update.id}`}
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-[#1ebcc7] hover:border-[#1ebcc7]/30 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(update.id, update.title)}
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white/30 text-xs">
            <Plus className="w-12 h-12 mb-3 opacity-50 text-[#1ebcc7]" />
            <span>No updates/articles found. Click "Write Update" to post your first article!</span>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-[#171717] border border-white/5 rounded-xl p-4">
          <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-white/5 hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.01] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-white/5 hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.01] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        moduleType="update"
        onCategoriesChange={fetchCategories}
      />
    </div>
  );
}

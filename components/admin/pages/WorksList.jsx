"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import api from '@/lib/adminApi';
import CategoryManagementModal from '../CategoryManagementModal';

export default function WorksList() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('display_order');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // Load categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', {
        params: { module: 'work' }
      });
      setCategories(response.data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Load works list
  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/works', {
        params: {
          search,
          category,
          status,
          sort,
          order,
          page,
          limit: 1000
        }
      });
      setWorks(response.data.works);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch works:', error);
      toast.error('Could not load portfolio works.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [search, category, status, sort, order, page]);

  // Handle Sort Change
  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
    setPage(1);
  };

  // Checkbox interactions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(works.map(w => w.id));
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

  // Bulk Actions
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await api.post('/works/bulk-status', { ids: selectedIds, status: newStatus });
      toast.success(`Selected works set to ${newStatus}`);
      setSelectedIds([]);
      fetchWorks();
    } catch (e) {
      toast.error('Bulk status update failed.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected works?`)) return;

    try {
      await api.post('/works/bulk-delete', { ids: selectedIds });
      toast.success('Selected works deleted successfully');
      setSelectedIds([]);
      fetchWorks();
    } catch (e) {
      toast.error('Bulk deletion failed.');
    }
  };

  // Single Actions
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/work/${id}`);
      toast.success(`Deleted work: ${title}`);
      fetchWorks();
    } catch (e) {
      toast.error('Deletion failed.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await api.post(`/work/${id}/duplicate`);
      toast.success('Work duplicated as draft!');
      fetchWorks();
    } catch (e) {
      toast.error('Duplication failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider font-bold">Portfolio Works</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Manage project case studies</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="bg-transparent hover:bg-white/5 border border-white/10 hover:border-[#1ebcc7]/30 text-white font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all"
          >
            Manage Work Categories
          </button>
          <Link href="/admin/works/new"
            className="bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-full flex items-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(30,188,199,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Work</span>
          </Link>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by title, client, category..."
            className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] focus:ring-1 focus:ring-[#1ebcc7] transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Filter Category */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          <select
            className="bg-[#171717] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] cursor-pointer"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Sectors</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            className="bg-[#171717] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7] cursor-pointer"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* BULK ACTIONS BOX */}
      {selectedIds.length > 0 && (
        <div className="bg-[#171717]/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4 animate-fade-in-up">
          <span className="text-xs font-semibold text-[#1ebcc7] uppercase tracking-wider pl-2">
            {selectedIds.length} Works Selected
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
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Retrieving portfolio works...</p>
          </div>
        ) : works.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/10 text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                  <th className="py-4 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.02] text-[#1ebcc7] focus:ring-[#1ebcc7] focus:ring-offset-0"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === works.length && works.length > 0}
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1.5">
                      <span>Work / Title</span>
                      {sort === 'title' && (order === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      {sort === 'category' && (order === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="py-4 px-4">Client / Year</th>
                  <th className="py-4 px-4 text-center">Top Work?</th>
                  <th className="py-4 px-4 text-center" onClick={() => handleSort('display_order')}>
                    <div className="flex items-center gap-1.5 justify-center cursor-pointer">
                      <span>Order</span>
                      {sort === 'display_order' && (order === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-semibold">
                {works.map((work) => (
                  <tr key={work.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/20 bg-white/[0.02] text-[#1ebcc7] focus:ring-[#1ebcc7] focus:ring-offset-0"
                        checked={selectedIds.includes(work.id)}
                        onChange={() => handleSelectOne(work.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={work.featured_image || 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?w=100'}
                          alt={work.title}
                          className="w-10 h-10 rounded-lg object-cover bg-black/20"
                        />
                        <div>
                          <p className="text-white hover:text-[#1ebcc7] transition-colors truncate max-w-[200px]">{work.title}</p>
                          <p className="text-[10px] text-white/30 font-semibold truncate max-w-[200px]">/{work.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      <span className="px-2 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1ebcc7]">
                        {work.category || 'Portfolio'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      <p>{work.client || 'Internal'}</p>
                      <p className="text-[10px] text-white/30 font-semibold">{work.year}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {work.is_top_work ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#1ebcc7]/10 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-wider">
                          Yes
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">No</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-white/70">{work.display_order}</td>
                    <td className="py-4 px-4 text-center">
                      {work.status === 'published' ? (
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
                          href={`https://www.askjey.in/works/${work.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-white hover:border-white/10 transition-all"
                          title="Preview live"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDuplicate(work.id)}
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-[#1ebcc7] hover:border-[#1ebcc7]/30 transition-all cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/admin/works/edit/${work.id}`}
                          className="p-1.5 rounded-md border border-white/5 text-white/50 hover:text-[#1ebcc7] hover:border-[#1ebcc7]/30 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(work.id, work.title)}
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
            <Briefcase className="w-12 h-12 mb-3 opacity-50 text-[#1ebcc7]" />
            <span>No portfolio works match the filters. Click "Create Work" to write your first project!</span>
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
        moduleType="work"
        onCategoriesChange={fetchCategories}
      />
    </div>
  );
}

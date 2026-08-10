"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Edit2, Trash2, Check, Loader2, RefreshCw } from 'lucide-react';
import api from '@/lib/adminApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { slugify } from '@/lib/utils';

export default function CategoryManagementModal({ isOpen, onClose, moduleType, onCategoriesChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Create Form State
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  // Fetch all categories for this module
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories', {
        params: {
          module: moduleType,
          search: search
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Reset inputs when opened
      setNewName('');
      setNewSlug('');
      setIsCustomSlug(false);
      setEditingId(null);
    }
  }, [isOpen, search]);

  // Handle name change for new category
  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewName(name);
    if (!isCustomSlug) {
      setNewSlug(slugify(name));
    }
  };

  // Handle slug change for new category
  const handleSlugChange = (e) => {
    setIsCustomSlug(true);
    setNewSlug(slugify(e.target.value));
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Category name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/categories', {
        name: newName,
        slug: newSlug || slugify(newName),
        moduleType
      });
      toast.success(`Category "${response.data.name}" added successfully.`);
      
      // Reset state
      setNewName('');
      setNewSlug('');
      setIsCustomSlug(false);
      
      fetchCategories();
      if (onCategoriesChange) onCategoriesChange();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to create category.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Click
  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  // Save Edit
  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      await api.put(`/categories/${id}`, {
        name: editName,
        slug: editSlug || slugify(editName)
      });
      toast.success('Category updated successfully.');
      setEditingId(null);
      fetchCategories();
      if (onCategoriesChange) onCategoriesChange();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to update category.';
      toast.error(msg);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    const moduleMsg = moduleType === 'work' 
      ? 'Any projects using this category will have their category removed. '
      : 'Any articles using this category will fall back to "General". ';
    
    if (!window.confirm(`Are you sure you want to delete "${name}"? ${moduleMsg}This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      toast.success(`Category "${name}" deleted.`);
      fetchCategories();
      if (onCategoriesChange) onCategoriesChange();
    } catch (error) {
      toast.error('Failed to delete category.');
    }
  };

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-[24px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-display text-xl uppercase tracking-wider font-bold">
              Manage {moduleType === 'work' ? 'Work' : 'Update'} Categories
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">
              Add, edit, or delete categories for this module
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-white/60">Create New Category</h3>
            <div>
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Virtual Reality"
                  value={newName}
                  onChange={handleNameChange}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                  required
                />
              </div>

              {/* Slug */}
              {/* <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex justify-between">
                  <span>URL Slug (Auto)</span>
                  {isCustomSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSlug(false);
                        setNewSlug(slugify(newName));
                      }}
                      className="text-[#1ebcc7] text-[9px] font-bold uppercase cursor-pointer hover:underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Reset to Auto
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="virtual-reality"
                  value={newSlug}
                  onChange={handleSlugChange}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
                />
              </div> */}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newName.trim()}
                className="bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Add Category</span>
              </button>
            </div>
          </form>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1ebcc7]"
            />
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-white/60">Category List ({categories.length})</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#1ebcc7]" />
              </div>
            ) : categories.length > 0 ? (
              <div className="border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/10 gap-3 text-xs"
                    >
                      {isEditing ? (
                        /* Edit Form */
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="bg-black/40 border border-[#1ebcc7]/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#1ebcc7]"
                            required
                          />
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(slugify(e.target.value))}
                            placeholder="Slug"
                            className="bg-black/40 border border-[#1ebcc7]/30 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#1ebcc7]"
                          />
                        </div>
                      ) : (
                        /* View Mode */
                        <div>
                          <p className="font-bold text-white text-sm">{cat.name}</p>
                          <p className="text-[10px] text-white/30 font-mono mt-0.5">/{cat.slug}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(cat.id)}
                              className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-[#1ebcc7] hover:border-[#1ebcc7]/20 transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-white/30">
                No categories found. Create your first one above!
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

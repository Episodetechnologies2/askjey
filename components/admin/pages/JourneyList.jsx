"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Edit2, Trash2, Loader2, Calendar, Eye, Copy, X } from "lucide-react";
import api from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";

export default function JourneyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Preview modal state
  const [previewItem, setPreviewItem] = useState(null);

  // Delete modal state
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/journey");
      setItems(response.data);
    } catch (e) {
      toast.error("Failed to load journey timeline items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Duplicate Item
  const handleDuplicate = async (item) => {
    const toastId = toast.loading("Duplicating milestone...");
    try {
      const copyData = {
        year: item.year,
        title: `${item.title} (Copy)`,
        shortDescription: item.shortDescription || item.short_description || "",
        longDescription: item.longDescription || item.long_description || "",
        image: item.image
      };
      await api.post("/journey", copyData);
      toast.success("Milestone duplicated successfully!", { id: toastId });
      fetchItems();
    } catch (error) {
      console.error("Duplicate error:", error);
      toast.error("Failed to duplicate milestone", { id: toastId });
    }
  };

  // Handle Single Delete
  const handleDelete = async () => {
    if (!deleteModalId) return;
    setDeleting(true);
    try {
      await api.delete(`/journey/${deleteModalId}`);
      toast.success("Journey entry deleted successfully");
      setDeleteModalId(null);
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete journey entry");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.year.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      (item.shortDescription || item.short_description || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider font-bold">Chronicles & Journey</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
            Manage "The Chronicles of Jey Anand" Timeline Milestones (Sorted by Year)
          </p>
        </div>

        <Link
          href="/admin/journey/new"
          className="inline-flex items-center justify-center gap-2 bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(30,188,199,0.2)] hover:shadow-[0_0_25px_rgba(30,188,199,0.4)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Milestone</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#171717]/60 border border-white/10 p-4 rounded-[20px]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by year or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#1ebcc7] transition-all"
          />
        </div>
        <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">
          Total Milestones: <span className="text-[#1ebcc7]">{items.length}</span>
        </div>
      </div>

      {/* Table / Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1ebcc7]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#171717]/40 border border-white/5 rounded-[24px]">
          <Calendar className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60 font-semibold text-sm">No journey items found</p>
          <p className="text-white/40 text-xs mt-1">Try adjusting your search query or add a new milestone.</p>
        </div>
      ) : (
        <div className="bg-[#171717]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50 bg-white/[0.02]">
                  <th className="p-5 font-semibold w-28">Year</th>
                  <th className="p-5 font-semibold w-20">Image</th>
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Short Description</th>
                  <th className="p-5 font-semibold w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const shortDesc = item.shortDescription || item.short_description || "";
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/[0.01] transition-colors text-sm"
                    >
                      <td className="p-5">
                        <span className="inline-block px-3 py-1 bg-[#1ebcc7]/10 text-[#1ebcc7] border border-[#1ebcc7]/20 rounded-full text-xs font-bold font-display">
                          {item.year}
                        </span>
                      </td>
                      <td className="p-5">
                        <img
                          src={item.image || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 bg-black/40"
                        />
                      </td>
                      <td className="p-5 font-semibold text-white">
                        {item.title}
                      </td>
                      <td className="p-5 text-white/60 max-w-md line-clamp-2">
                        {shortDesc}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Preview / View Live on User Page */}
                          <a
                            href={`/journey#milestone-${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#1ebcc7]/20 hover:border-[#1ebcc7]/40 text-white/60 hover:text-[#1ebcc7] transition-all cursor-pointer"
                            title="View Live on User Page"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          {/* 2. Duplicate Button */}
                          <button
                            onClick={() => handleDuplicate(item)}
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#1ebcc7]/20 hover:border-[#1ebcc7]/40 text-white/60 hover:text-[#1ebcc7] transition-all cursor-pointer"
                            title="Duplicate Milestone"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* 3. Edit Button */}
                          <Link
                            href={`/admin/journey/edit/${item.id}`}
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#1ebcc7]/20 hover:border-[#1ebcc7]/40 text-white/60 hover:text-[#1ebcc7] transition-all"
                            title="Edit Milestone"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* 4. Delete Button */}
                          <button
                            onClick={() => setDeleteModalId(item.id)}
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-red-500/20 hover:border-red-500/40 text-white/60 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#171717] border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#1ebcc7]/10 text-[#1ebcc7] border border-[#1ebcc7]/20 rounded-full text-xs font-bold font-display">
                    {previewItem.year}
                  </span>
                  <h3 className="font-display text-xl uppercase font-bold text-white">
                    {previewItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card Preview */}
              <div className="relative rounded-[20px] overflow-hidden border border-white/15 bg-black/50 aspect-video group">
                <img
                  src={previewItem.image || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[#1ebcc7] text-xs font-bold font-display uppercase tracking-widest mb-1">
                    {previewItem.year}
                  </span>
                  <h4 className="text-xl font-bold font-display uppercase text-white mb-2">
                    {previewItem.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {previewItem.shortDescription || previewItem.short_description}
                  </p>
                </div>
              </div>

              {/* Extended Details */}
              <div className="space-y-3 bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">Full Narrative</h4>
                <p className="text-sm text-white/80 leading-relaxed font-body">
                  {previewItem.longDescription || previewItem.long_description || previewItem.shortDescription}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Link
                  href={`/admin/journey/edit/${previewItem.id}`}
                  onClick={() => setPreviewItem(null)}
                  className="inline-flex items-center gap-2 bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit This Milestone</span>
                </Link>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white/60 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#171717] border border-white/10 rounded-[24px] p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg uppercase font-bold text-white">Delete Milestone?</h3>
              <p className="text-xs text-white/60">
                Are you sure you want to delete this journey entry? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white/60 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full transition-all disabled:opacity-50 cursor-pointer"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import api from "@/lib/adminApi";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ priceInr: "", priceUsd: "", notes: "" });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get("/services");
      setServices(response.data);
    } catch (e) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    setEditingId(service.id);
    setEditForm({
      priceInr: service.priceInr || service.price_inr || "",
      priceUsd: service.priceUsd || service.price_usd || "",
      notes: service.notes || ""
    });
  };

  const handleSave = async (id) => {
    try {
      await api.put("/services", {
        id,
        priceInr: editForm.priceInr,
        priceUsd: editForm.priceUsd,
        notes: editForm.notes
      });
      toast.success("Service updated successfully");
      setEditingId(null);
      fetchServices();
    } catch (e) {
      toast.error("Failed to update service");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider font-bold">Services & Pricing</h1>
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Manage corporate services pricing tiers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1ebcc7]" />
        </div>
      ) : (
        <div className="bg-[#171717]/60 border border-white/10 rounded-[24px] overflow-hidden">
          <table className="w-full text-left border-collapse font-body">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50 bg-white/[0.02]">
                <th className="p-5 font-semibold">Service Name</th>
                <th className="p-5 font-semibold w-48">INR Price</th>
                <th className="p-5 font-semibold w-48">USD Price</th>
                <th className="p-5 font-semibold">Notes</th>
                <th className="p-5 font-semibold w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors text-sm">
                  <td className="p-5 font-semibold text-white">{service.name}</td>
                  <td className="p-5">
                    {editingId === service.id ? (
                      <input
                        type="text"
                        value={editForm.priceInr}
                        onChange={(e) => setEditForm({ ...editForm, priceInr: e.target.value })}
                        className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 w-full text-white text-sm focus:outline-none focus:border-[#1ebcc7]"
                      />
                    ) : (
                      <span className="text-[#1ebcc7] font-semibold">{service.priceInr || service.price_inr}</span>
                    )}
                  </td>
                  <td className="p-5">
                    {editingId === service.id ? (
                      <input
                        type="text"
                        value={editForm.priceUsd}
                        onChange={(e) => setEditForm({ ...editForm, priceUsd: e.target.value })}
                        className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 w-full text-white text-sm focus:outline-none focus:border-[#1ebcc7]"
                      />
                    ) : (
                      <span className="text-white/80">{service.priceUsd || service.price_usd}</span>
                    )}
                  </td>
                  <td className="p-5 text-white/40">
                    {editingId === service.id ? (
                      <input
                        type="text"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 w-full text-white text-sm focus:outline-none focus:border-[#1ebcc7]"
                      />
                    ) : (
                      service.notes
                    )}
                  </td>
                  <td className="p-5 text-right">
                    {editingId === service.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleSave(service.id)} className="p-1.5 rounded-lg bg-[#1ebcc7]/10 hover:bg-[#1ebcc7]/20 text-[#1ebcc7] transition-all">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(service)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

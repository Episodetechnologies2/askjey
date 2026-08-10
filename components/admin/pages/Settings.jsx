"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Save, Globe, Info, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import api from "@/lib/adminApi";

export default function Settings() {
  const [settings, setSettings] = useState({
    website_name: "",
    meta_title: "",
    meta_description: "",
    footer_content: "",
    analytics_code: "",
    contact_details: {
      email: "",
      phone: "",
      location: ""
    },
    social_links: {
      twitter: "",
      linkedin: "",
      instagram: "",
      facebook: "",
      youtube: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        const data = response.data;
        setSettings({
          website_name: data.website_name || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          footer_content: data.footer_content || "",
          analytics_code: data.analytics_code || "",
          contact_details: {
            email: data.contact_details?.email || "",
            phone: data.contact_details?.phone || "",
            location: data.contact_details?.location || ""
          },
          social_links: {
            twitter: data.social_links?.twitter || "",
            linkedin: data.social_links?.linkedin || "",
            instagram: data.social_links?.instagram || "",
            facebook: data.social_links?.facebook || "",
            youtube: data.social_links?.youtube || ""
          }
        });
      } catch (e) {
        toast.error("Failed to load platform settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", {
        website_name: settings.website_name,
        meta_title: settings.meta_title,
        meta_description: settings.meta_description,
        footer_content: settings.footer_content,
        analytics_code: settings.analytics_code,
        contact_details: settings.contact_details,
        social_links: settings.social_links
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-white/40">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider font-bold">Platform Settings</h1>
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
          Configure general website information, SEO metadata, contact info, and social integration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: GENERAL & SEO */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1ebcc7] flex items-center gap-2 border-b border-white/5 pb-3">
            <Globe className="w-4 h-4" />
            <span>General & SEO Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Website Name</label>
              <input
                type="text"
                placeholder="AskJey"
                value={settings.website_name}
                onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 px-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">SEO Meta Title</label>
              <input
                type="text"
                placeholder="Ask Jey | Strategy, Branding, Mentorship"
                value={settings.meta_title}
                onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 px-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">SEO Meta Description</label>
            <textarea
              rows={3}
              placeholder="Enter search engine description snippet..."
              value={settings.meta_description}
              onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 px-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Footer Copyright Notice</label>
              <input
                type="text"
                placeholder="© 2026 AskJey. All rights reserved."
                value={settings.footer_content}
                onChange={(e) => setSettings({ ...settings, footer_content: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 px-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Google Analytics ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.analytics_code}
                onChange={(e) => setSettings({ ...settings, analytics_code: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 px-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-2 border-b border-white/5 pb-3">
            <Info className="w-4 h-4" />
            <span>Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  placeholder="hello@askjey.in"
                  value={settings.contact_details.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact_details: { ...settings.contact_details, email: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>
{/* 
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={settings.contact_details.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact_details: { ...settings.contact_details, phone: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div> */}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Location / Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Coimbatore, India"
                  value={settings.contact_details.location}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact_details: { ...settings.contact_details, location: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SOCIAL LINKS */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2 border-b border-white/5 pb-3">
            <Twitter className="w-4 h-4" />
            <span>Social Integration Profiles</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Twitter / X URL</label>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="https://x.com/username"
                  value={settings.social_links.twitter}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, twitter: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={settings.social_links.linkedin}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, linkedin: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Instagram URL</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="https://instagram.com/username"
                  value={settings.social_links.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, instagram: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Facebook URL</label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="https://facebook.com/username"
                  value={settings.social_links.facebook || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">YouTube URL</label>
              <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="https://youtube.com/@channel"
                  value={settings.social_links.youtube || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, youtube: e.target.value }
                  })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-sm py-4 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(30,188,199,0.3)]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings changes</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}

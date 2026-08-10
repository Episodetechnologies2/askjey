"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SettingsContext = createContext(null);

export const DEFAULT_SETTINGS = {
  website_name: "AskJey",
  meta_title: "Jey Anand — Creative Strategy & Product Design.",
  meta_description: "Jey Anand is a multidisciplinary consultant specializing in design, technology, branding, and business storytelling.",
  logo_url: "/assets/logo.svg",
  favicon_url: "/assets/logo.svg",
  social_links: {
    twitter: "https://x.com/AskJeyAnand",
    linkedin: "https://www.linkedin.com/in/askjey/",
    instagram: "https://www.instagram.com/ask.jey/"
  },
  contact_details: {
    email: "hello@askjey.in",
    phone: "+91 98765 43210",
    location: "Coimbatore, India"
  },
  footer_content: "© 2026 Jey Anand. All rights reserved.",
  analytics_code: ""
};

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!initialSettings);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      const data = res.data;
      
      setSettings({
        website_name: data.website_name || DEFAULT_SETTINGS.website_name,
        meta_title: data.meta_title || DEFAULT_SETTINGS.meta_title,
        meta_description: data.meta_description || DEFAULT_SETTINGS.meta_description,
        logo_url: data.logo_url || DEFAULT_SETTINGS.logo_url,
        favicon_url: data.favicon_url || DEFAULT_SETTINGS.favicon_url,
        social_links: {
          twitter: data.social_links?.twitter || DEFAULT_SETTINGS.social_links.twitter,
          linkedin: data.social_links?.linkedin || DEFAULT_SETTINGS.social_links.linkedin,
          instagram: data.social_links?.instagram || DEFAULT_SETTINGS.social_links.instagram,
        },
        contact_details: {
          email: data.contact_details?.email || DEFAULT_SETTINGS.contact_details.email,
          phone: data.contact_details?.phone || DEFAULT_SETTINGS.contact_details.phone,
          location: data.contact_details?.location || DEFAULT_SETTINGS.contact_details.location,
        },
        footer_content: data.footer_content || DEFAULT_SETTINGS.footer_content,
        analytics_code: data.analytics_code || DEFAULT_SETTINGS.analytics_code,
      });
    } catch (err) {
      console.error("Error loading frontend settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

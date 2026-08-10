"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GalleryGrid({ gallery }) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
      {gallery.map((imgUrl, index) => (
        <motion.div
          key={imgUrl + index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          className="relative group overflow-hidden rounded-[20px] shadow-sm bg-neutral-100 aspect-video md:aspect-auto md:h-[320px]"
        >
          <motion.img
            src={imgUrl}
            alt={`Gallery item ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

export default function WorkModal({ work, onClose }) {
  if (!work) return null;

  // Prevent scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Close on escape key press
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-10 select-none">
        
        {/* Blurred Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl cursor-zoom-out"
        />

        {/* Modal Main Panel - Dark Canvas Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-5xl bg-[#050505] text-white border-0 md:border border-white/10 rounded-none md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-10"
        >
          
          {/* Sticky Close Button on Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-md border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1 select-text scroll-smooth px-6 py-12 md:px-16 md:py-16 lg:px-24 lg:py-20 custom-scrollbar">
            
            {/* Header Block */}
            <div className="max-w-2xl mx-auto mb-12 md:mb-16 mt-4 md:mt-8 px-2 md:px-0">
              <span className="inline-block text-[#1ebcc7] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                {work.category}
              </span>
              <h1 className="font-body text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none mb-6">
                {work.title}
              </h1>
              <p className="text-base md:text-lg text-white/70 leading-relaxed font-body mb-6">
                {work.longDescription}
              </p>
              
              <a
                href="#visit"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`In a production environment, this link directs the user to the live deployment page for ${work.title}.`);
                }}
                className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white border-b border-white pb-0.5 hover:text-[#1ebcc7] hover:border-[#1ebcc7] transition-all duration-300 w-fit cursor-pointer"
              >
                Launch Project
                <ArrowUpRight size={14} className="stroke-[2.5]" />
              </a>
            </div>

            {/* Project Story Content - Interleaved Images and Story Blocks */}
            <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
              {work.story && work.story.map((item, idx) => (
                <div key={idx} className="space-y-6 md:space-y-8">
                  
                  {/* Render Image if it exists */}
                  {item.image && (
                    <div className="w-full overflow-hidden rounded-[12px] md:rounded-[20px] bg-black/40 border border-white/5 shadow-inner">
                      <img
                        src={item.image}
                        alt={item.title || `${work.title} presentation ${idx + 1}`}
                        className="w-full h-auto object-cover block"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Render Title/Text block if either exists */}
                  {(item.title || item.text) && (
                    <div className="max-w-2xl mx-auto px-2 md:px-0">
                      {item.title && (
                        <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-tight font-body">
                          {item.title}
                        </h3>
                      )}
                      {item.text && (
                        <p className="text-sm md:text-base text-white/65 leading-relaxed font-body">
                          {item.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

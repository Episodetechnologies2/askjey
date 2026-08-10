"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWorks } from '@/lib/api';
import WorkCard from "./WorkCard";
import WorkModal from "./WorkModal";

export default function WorkSection() {
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedSector, setSelectedSector] = useState("ALL");

  useEffect(() => {
    async function loadWorks() {
      try {
        const data = await fetchWorks();
        if (data) {
          const nonFeatured = data.filter(w => !w.isTopWork);
          setWorks(nonFeatured);
        }
      } catch (err) {
        console.error("API error loading works:", err);
      }
    }
    loadWorks();
  }, []);

  // Dynamically extract all sectors and convert to uppercase for filters
  const sectors = ["ALL", ...Array.from(new Set(works.map((w) => w.category.toUpperCase())))];

  const filteredWorks = selectedSector === "ALL"
    ? works
    : works.filter((w) => w.category.toUpperCase() === selectedSector);


  // Animation variants for heading/description
  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1], // premium easeOutCubic
        staggerChildren: 0.15
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative w-full bg-black py-[120px] px-6 text-white overflow-hidden border-t border-white/5">
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Block */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="mb-12 flex flex-col items-start"
        >
          <motion.span
            variants={childVariants}
            className="text-[#1ebcc7] text-xs font-bold uppercase tracking-[0.24em] mb-4"
          >
            Portfolio Showcase
          </motion.span>
          
          <motion.h2
            variants={childVariants}
            className="font-display text-6xl md:text-8xl lg:text-[7.5rem] font-bold uppercase leading-[0.85] text-white tracking-tight"
          >
            Work
          </motion.h2>
          
          <motion.p
            variants={childVariants}
            className="mt-6 md:mt-8 max-w-2xl font-body text-base md:text-lg text-white/60 leading-relaxed"
          >
            Real businesses. Real impact. Every project tells a story of innovation, creativity, and measurable growth.
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 md:gap-3 mb-16 max-w-5xl"
        >
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`rounded-full border px-4 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none ${
                selectedSector === sector
                  ? "border-[#1ebcc7] text-[#1ebcc7] bg-[#1ebcc7]/5"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80"
              }`}
            >
              {sector}
            </button>
          ))}
        </motion.div>

        {/* Work Grid with layout animations */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="flex"
              >
                <WorkCard
                  work={work}
                  onClick={setSelectedWork}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full-Screen Modal Portal (Conditional Rendering with AnimatePresence) */}
      <AnimatePresence>
        {selectedWork && (
          <WorkModal
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

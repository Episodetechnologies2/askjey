"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function WorkCard({ work, onClick }) {
  // Framer Motion variants
  const cardVariants = {
    rest: { y: 0 },
    hover: { y: -8 }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 0.25 }
  };

  const transitionConfig = {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1] // cubic-bezier for premium, smooth transition
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={transitionConfig}
      onClick={() => onClick(work)}
      className="group w-full cursor-pointer flex flex-col justify-start select-none"
    >
      {/* Aspect Ratio 4:3 Image Container with rounded corners */}
      <div className="relative overflow-hidden aspect-[4/3] rounded-[16px] bg-[#0a0a0b] border border-white/5">
        {/* Animated Image */}
        <motion.img
          src={work.featuredImage}
          alt={work.title}
          variants={imageVariants}
          transition={transitionConfig}
          className="w-full h-full object-cover"
        />

        {/* Fade-in dark overlay */}
        <motion.div
          variants={overlayVariants}
          transition={transitionConfig}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      </div>

      {/* Card Content underneath, flush with the image edges */}
      <div className="pt-4 flex flex-col items-start">
        {/* Project Name */}
        <h3 className="text-base md:text-lg font-semibold text-white tracking-wide group-hover:text-primary transition-colors duration-300 font-body">
          {work.title}
        </h3>

        {/* Services Subtitle */}
        <p className="text-xs md:text-sm text-white/40 font-body mt-1 leading-normal">
          {work.services && work.services.slice(0, 2).join(" / ")}
        </p>
      </div>
    </motion.div>
  );
}

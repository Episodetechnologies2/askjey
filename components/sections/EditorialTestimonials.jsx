"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";

export default function EditorialTestimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "JEY'S CROSS-INDUSTRY PERSPECTIVE COMPLETELY CHANGED HOW WE APPROACHED OUR BUSINESS. WITHIN SIX MONTHS WE REDEFINED OUR STRATEGY, EXPANDED INTO TWO NEW MARKETS, AND SUCCESSFULLY LAUNCHED OUR FIRST DIGITAL PRODUCT.",
      name: "SARAH CHEN",
      role: "CEO",
      company: "TechStart",
      profile_image: "/assets/testimonials/client_sarah.png",
    },
    {
      id: 2,
      quote: "My mentorship experience with Jey Anand, Founder of Episode Technologies and Happy Brand Consulting, Pingle, has been truly transformative. What sets Jey apart is his process-driven approach to everything he does. He doesn’t believe in vague strategies or shortcuts. There is a method, a system, and a reason behind every action—and he ensures that you understand it, follow it, and stay consistent with it. Through his mentorship, I have gained a completely different perspective on business management, people management, leadership, and execution. His greatest strength is his ability to bring structure to ideas, identify gaps, and turn them into actionable processes. But more than the processes, Jey teaches you discipline and consistency. He pushes you to move from simply knowing what to do to actually doing it consistently—and that is where real growth happens. His practical experience, sharp business understanding, strong people-management skills, and relentless focus on execution make him more than a mentor. He is someone who teaches you how to build the mindset and systems required to become a better entrepreneur. I am genuinely grateful for the learning and perspective he has given me. If you are looking for someone who will challenge your thinking, bring structure to your approach, and push you towards meaningful execution, Jey Anand is the kind of mentor you want to learn from.",
      name: "MARCUS VANCE",
      role: "Managing Director",
      company: "Vanguard Capital",
      profile_image: null,
    },
    {
      id: 3,
      quote: "Working with Jey Anand and doing projects together was one of the most transformative experiences of my career. I learned not only what to do, but also what not to do. Every day brought a new challenge from helping manage his restaurant operations to sitting in meetings with multimillionaires and billionaires. Every conversation, every task, and every piece of advice carried a lesson. Those experiences gave me confidence, broadened my perspective, and shaped the way I approach both work and life. I’m truly grateful for everything I learned during that journey.",
      name: "HARI",
      role: "Founder",
      company: "Monk Labs",
      profile_image: null,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const current = testimonials[activeIndex];
  const total = testimonials.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
    setIsModalOpen(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setIsModalOpen(false);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Check if current testimonial has profile image
  const hasImage = !!current.profile_image;

  // Truncation logic to keep section size uniform
  const maxQuoteLength = 160;
  const isTruncated = current.quote.length > maxQuoteLength;
  const displayQuote = isTruncated
    ? current.quote.slice(0, maxQuoteLength).trim() + "..."
    : current.quote;

  // Image Layout Variants (Option 1)
  const imageLayoutVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {},
  };

  const quoteLeftVariants = {
    initial: { opacity: 0, x: -60 },
    animate: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      opacity: 0, 
      x: -30, 
      transition: { duration: 0.4, ease: "easeIn" } 
    },
  };

  const portraitRightVariants = {
    initial: { opacity: 0, x: 60, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      opacity: 0, 
      x: 30, 
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeIn" } 
    },
  };

  const infoUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { duration: 0.3, ease: "easeIn" } 
    },
  };

  // Text-Only Layout Variants (Option 2)
  const textLayoutVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    exit: {},
  };

  const quoteCenterVariants = {
    initial: { opacity: 0, y: 50, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: -30, 
      scale: 0.98,
      transition: { duration: 0.4, ease: "easeIn" } 
    },
  };

  const infoCenterVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3, ease: "easeIn" } 
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-black py-12 lg:py-16 border-y border-white/5">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        
        {/* Testimonials Container */}
        <div className="min-h-[250px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {hasImage ? (
              /* Option 1: Image Available (Split Layout) */
              <motion.div
                key={current.id}
                variants={imageLayoutVariants}
                initial="initial"
                whileInView="animate"
                exit="exit"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full flex flex-col items-center gap-8 text-center md:flex-col md:items-start md:text-left lg:grid lg:grid-cols-[1.8fr_1fr] lg:gap-16 lg:items-center"
              >
                {/* Left Side Quote */}
                <motion.div 
                  variants={quoteLeftVariants}
                  className="w-full lg:col-start-1 lg:row-start-1 order-1 md:order-1 text-center md:text-left relative"
                >
                  {/* Large Stylized Quotation Mark */}
                  <span className="absolute -top-12 -left-6 select-none font-display text-[8rem] leading-none text-white/5 opacity-40 md:-top-16 md:-left-10 lg:-top-20 lg:-left-12">
                    “
                  </span>
                  
                  <blockquote 
                    onClick={() => setIsModalOpen(true)}
                    className="font-display text-4xl font-bold uppercase leading-[1.08] text-white sm:text-5xl md:text-5xl lg:text-6xl tracking-tight relative z-10 cursor-pointer hover:text-white/80 transition-colors duration-300 select-none"
                  >
                    "{displayQuote}"
                  </blockquote>
                </motion.div>

                {/* Right Side Portrait */}
                <motion.div
                  variants={portraitRightVariants}
                  className="w-full lg:col-start-2 lg:row-start-1 lg:row-span-2 order-2 md:order-3 md:mx-0 flex justify-center lg:justify-end"
                >
                  <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/80 transition-all duration-500 max-w-[280px] sm:max-w-[320px] lg:max-w-full aspect-[4/5]">
                    <motion.div
                      whileHover={{ scale: 1.03, filter: "grayscale(100%) brightness(1.1)" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative w-full h-full grayscale overflow-hidden rounded-xl"
                    >
                      <Image
                        src={current.profile_image}
                        alt={`${current.name} Portrait`}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Left Side Client Info (rendered below Portrait on mobile/tablet, but column 1 row 2 on desktop) */}
                <motion.div
                  variants={infoUpVariants}
                  className="w-full lg:col-start-1 lg:row-start-2 order-3 md:order-2 text-center md:text-left mt-4 md:mt-6 lg:mt-8"
                >
                  <h4 className="font-display text-xl font-bold uppercase tracking-widest text-primary">
                    {current.name}
                  </h4>
                  <p className="mt-1 font-body text-sm font-medium uppercase tracking-wider text-white/50">
                    {current.role}, <span className="text-white/30">{current.company}</span>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              /* Option 2: Image Not Available (Centered Editorial Quote) */
              <motion.div
                key={current.id}
                variants={textLayoutVariants}
                initial="initial"
                whileInView="animate"
                exit="exit"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full max-w-4xl mx-auto flex flex-col items-center text-center py-8"
              >
                {/* Centered Editorial Quote */}
                <motion.div 
                  variants={quoteCenterVariants}
                  className="relative w-full"
                >
                  {/* Large Centered Stylized Quotation Mark */}
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 select-none font-display text-[8rem] leading-none text-white/5 opacity-40 md:-top-16 lg:-top-20">
                    “
                  </span>
                  
                  <blockquote 
                    onClick={() => setIsModalOpen(true)}
                    className="font-display text-4xl font-bold uppercase leading-[1.08] text-white sm:text-5xl md:text-6xl tracking-tight relative z-10 cursor-pointer hover:text-white/80 transition-colors duration-300 select-none"
                  >
                    "{displayQuote}"
                  </blockquote>
                </motion.div>

                {/* Centered Client Info */}
                <motion.div
                  variants={infoCenterVariants}
                  className="mt-12 text-center"
                >
                  <h4 className="font-display text-2xl font-bold uppercase tracking-widest text-primary">
                    {current.name}
                  </h4>
                  <p className="mt-2 font-body text-sm font-medium uppercase tracking-wider text-white/50">
                    {current.role}, <span className="text-white/30">{current.company}</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Editorial Navigation System */}
        <div className="mt-8 md:mt-10 lg:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-white/10 pt-8">
          {/* Slide Indicator (e.g. 01 / 03) */}
          <div className="flex items-center gap-4 font-display text-sm tracking-widest text-white/40">
            <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, "0")}</span>
            <div className="w-12 h-[1px] bg-white/20" />
            <span>{String(total).padStart(2, "0")}</span>
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center gap-8">
            <button
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="group flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors duration-300 pointer-events-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>PREV</span>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="group flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors duration-300 pointer-events-auto cursor-pointer"
            >
              <span>NEXT</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 py-12 md:py-16 max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl shadow-black/80 pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors duration-300 p-2 cursor-pointer pointer-events-auto"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className={current.profile_image ? "grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 md:gap-12 items-center" : "flex flex-col items-center text-center"}>
                <div className={current.profile_image ? "text-left" : "text-center max-w-2xl mx-auto"}>
                  {/* Quote */}
                  <span className="text-primary font-display text-6xl leading-none block -mb-4 select-none">“</span>
                  <blockquote className="font-body text-lg sm:text-xl md:text-2xl font-light text-white/95 leading-relaxed italic">
                    "{current.quote}"
                  </blockquote>
                  
                  {/* Info */}
                  <div className="mt-8">
                    <h4 className="font-display text-xl font-bold uppercase tracking-widest text-primary">
                      {current.name}
                    </h4>
                    <p className="mt-1 font-body text-sm font-medium uppercase tracking-wider text-white/50">
                      {current.role}, <span className="text-white/30">{current.company}</span>
                    </p>
                  </div>
                </div>

                {current.profile_image && (
                  <div className="flex justify-center md:justify-end">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 p-2 bg-white/5 max-w-[240px] md:max-w-full aspect-[4/5] w-full shadow-lg">
                      <div className="relative w-full h-full grayscale rounded-xl overflow-hidden">
                        <Image
                          src={current.profile_image}
                          alt={`${current.name} Portrait`}
                          width={300}
                          height={375}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

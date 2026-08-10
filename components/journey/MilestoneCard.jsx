"use client";

import { useState, useEffect } from "react";
import { TrendingUp, X, ChevronRight } from "lucide-react";

/* ── Full-content modal ───────────────────────────────────────────────── */
function MilestoneModal({ milestone, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!milestone) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl pt-[72px] px-4 sm:px-6 lg:px-10 pb-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-medium-dark border border-border-gray rounded-xl overflow-hidden shadow-2xl
                   grid lg:grid-cols-[1fr_1.4fr] lg:h-[80vh]
                   max-h-[90vh] lg:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close — top-right of the whole dialog */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 hover:border-white/40 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LEFT: Image */}
        <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden">
          <img
            src={milestone.image}
            alt={milestone.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Strong bottom gradient so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Year + title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary text-black px-3 py-1 rounded-full text-xs font-display font-bold">
                {milestone.year}
              </div>
              <div className="h-px bg-primary/30 flex-1" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-display font-bold leading-tight">
              {milestone.title}
            </h2>
          </div>
        </div>

        {/* RIGHT: Scrollable content */}
        <div className="overflow-y-auto bg-gradient-to-br from-medium-dark/50 to-medium-dark">
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center min-h-full space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-primary/50" />
              <TrendingUp className="w-4 h-4 text-primary/60" />
            </div>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-body font-light">
              {milestone.longDescription}
            </p>

            <div className="h-px bg-border-gray/50" />

            {milestone.description && (
              <p className="text-sm text-medium-gray/80 leading-relaxed font-body italic">
                {milestone.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MilestoneCard ────────────────────────────────────────────────────── */
/**
 * Clicking anywhere on the card opens the full-content modal.
 * longDescription is clamped to 4 lines on the card.
 * Both grey dividers and italic description are always visible.
 */
const MilestoneCard = ({ milestone }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Entire card is clickable */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full text-left cursor-pointer group/card focus:outline-none"
      >
        <div className="bg-medium-dark rounded-xl border border-border-gray overflow-hidden w-full grid lg:grid-cols-[1fr_1.2fr] lg:h-[340px] transition-all duration-300 group-hover/card:border-primary/40 group-hover/card:shadow-[0_0_30px_rgba(30,188,199,0.06)]">

          {/* Left: Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
            <img
              src={milestone.image}
              alt={milestone.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-black px-3 py-1 rounded-full text-xs font-display font-bold">
                  {milestone.year}
                </div>
                <div className="h-px bg-primary/30 flex-1" />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-display line-clamp-2">
                {milestone.title}
              </h3>
            </div>
          </div>

          {/* Right: Text */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-medium-dark/50 to-medium-dark overflow-hidden">
            <div className="space-y-3 md:space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-primary/50" />
                <TrendingUp className="w-4 h-4 text-primary/60" />
              </div>

              <p className="text-sm md:text-base lg:text-[0.95rem] text-white leading-relaxed font-light line-clamp-4">
                {milestone.longDescription}
              </p>

              {/* Grey divider */}
              <div className="h-px bg-border-gray/50" />

              <p className="text-xs md:text-sm text-medium-gray/80 leading-relaxed italic line-clamp-2">
                {milestone.description}
              </p>

              {/* Grey divider before Read More */}
              <div className="h-px bg-border-gray/30" />

              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover/card:text-white transition-colors duration-200">
                Read More
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/card:translate-x-1" />
              </span>

            </div>
          </div>
        </div>
      </button>

      {modalOpen && (
        <MilestoneModal
          milestone={milestone}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default MilestoneCard;

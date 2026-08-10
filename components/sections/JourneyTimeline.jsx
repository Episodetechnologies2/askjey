"use client";

/**
 * JourneyTimeline — "The Chronicles of Jey Anand"
 *
 * Layout (desktop + mobile):
 *   All milestone cards are rendered in a normal vertical list.
 *   No scroll-trapping, no pinning — just smooth natural scroll.
 *
 * Desktop (≥1024px):
 *   Left sidebar shows all years in two columns. Sidebar is sticky so it
 *   stays in view while the cards scroll past. Active year highlights as
 *   the corresponding card enters the viewport.
 *
 * Mobile (<1024px):
 *   Sticky horizontal pill bar at the top highlights the active year.
 *   Cards stack vertically below it.
 *
 * Active-year detection: IntersectionObserver — works on all viewport sizes
 * without any manual scroll math.
 */
import { useState, useEffect, useRef, useCallback } from "react";

import { journeyMilestones } from '@/lib/data/journeyMilestones';
import MilestoneCard from "../journey/MilestoneCard";
import YearNav from "../journey/YearNav";

// ─────────────────────────────────────────────────────────────────────────────

const JourneyTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const milestoneRefs = useRef([]);   // one ref per card — observed by IO
  const yearButtonRefs = useRef([]);  // mobile pill buttons — auto-scrolled

  // Derive unique years and map each to the first milestone index of that year
  const uniqueYears = [];
  const yearToFirstIndex = {};
  journeyMilestones.forEach((milestone, index) => {
    if (!yearToFirstIndex.hasOwnProperty(milestone.year)) {
      yearToFirstIndex[milestone.year] = index;
      uniqueYears.push(milestone.year);
    }
  });

  const activeYear = journeyMilestones[activeIndex]?.year;
  const activeYearIndex = uniqueYears.indexOf(activeYear);

  // ── Active year detection via IntersectionObserver ────────────────────────
  // Works on both desktop and mobile with zero scroll-math.
  // A card becomes "active" when its top edge crosses the 25% marker from
  // the top of the viewport (below the sticky header + nav bar).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to — but still above — the detection line.
        // We sort by boundingClientRect.top ascending and pick the last one
        // that is intersecting, which corresponds to the topmost visible card.
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          const topEntry = intersecting[0];
          const idx = milestoneRefs.current.indexOf(topEntry.target);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        // "-25% 0px -55% 0px" means the card must occupy the middle 20% band
        // of the viewport to be considered "active". Adjust as needed.
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      }
    );

    const els = milestoneRefs.current;
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Mobile: keep active pill visible in the horizontal bar ───────────────
  useEffect(() => {
    if (activeYearIndex !== -1) {
      yearButtonRefs.current[activeYearIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeYearIndex]);

  // ── Year nav click — smooth scroll to the target card ────────────────────
  const onYearClick = useCallback((index) => {
    milestoneRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveIndex(index);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="relative bg-black">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-5" />
      </div>

      <div className="container relative z-10 py-8 md:py-12">
        {/* Section heading */}
        <div className="mb-8 md:mb-10 px-4 md:px-6 lg:px-8">
          <h2 className="flex text-white items-start gap-3 font-display font-bold tracking-tight leading-tight text-[clamp(1.75rem,3.5vw,2.5rem)]">
            <span className="text-primary font-light">|</span>
            The Chronicles of Jey Anand
          </h2>
        </div>

        {/* ── Mobile: sticky horizontal pill bar ─────────────────────────── */}
        <div className="lg:hidden sticky top-18 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 pb-2 mb-4 bg-black/90 backdrop-blur-md border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {uniqueYears.map((year, uIdx) => {
              const firstIndex = yearToFirstIndex[year];
              const isActive = activeYear === year;
              return (
                <button
                  key={year}
                  ref={(el) => (yearButtonRefs.current[uIdx] = el)}
                  onClick={() => onYearClick(firstIndex)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-display transition-all duration-300 border-b-2 ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-white/60 border-transparent hover:text-white hover:border-white/30"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Body: sticky sidebar (desktop) + scrolling card list ─────── */}
        <div className="flex gap-6 lg:gap-10 px-4 md:px-6 lg:px-8 items-start">

          {/* Desktop sticky year sidebar */}
          <div className="hidden lg:block shrink-0 sticky top-24 self-start">
            <YearNav
              milestones={journeyMilestones}
              activeIndex={activeIndex}
              onYearClick={onYearClick}
              yearButtonRefs={yearButtonRefs}
              desktopOnly
            />
          </div>

          {/* Card list — natural vertical flow on all screen sizes */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-5">
            {journeyMilestones.map((milestone, index) => (
              <div
                key={index}
                ref={(el) => (milestoneRefs.current[index] = el)}
                className="scroll-mt-28"
              >
                <MilestoneCard milestone={milestone} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
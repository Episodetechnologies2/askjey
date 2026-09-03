"use client";

/**
 * JourneyTimeline — "The Chronicles of Jey Anand"
 *
 * Dynamic CMS & Responsive Timeline Layout:
 *   - Fetches milestones from /api/journey with fallback to local JSON.
 *   - Unique year list deduplicates shared years (e.g. multiple 2026 entries)
 *     so each year appears ONLY ONCE in the navigation.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { journeyMilestones as initialMilestones } from '@/lib/data/journeyMilestones';
import MilestoneCard from "../journey/MilestoneCard";
import YearNav from "../journey/YearNav";

const JourneyTimeline = () => {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [activeIndex, setActiveIndex] = useState(0);

  const milestoneRefs = useRef([]);   // one ref per card — observed by IO
  const yearButtonRefs = useRef([]);  // mobile pill buttons — auto-scrolled

  // Fetch dynamic journey milestones from CMS API
  useEffect(() => {
    let isMounted = true;
    async function loadJourney() {
      try {
        const res = await fetch("/api/journey");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            const formatted = data.map((item) => ({
              id: item.id,
              year: String(item.year),
              title: item.title,
              description: item.shortDescription || item.short_description || "",
              longDescription: item.longDescription || item.long_description || item.shortDescription || "",
              image: item.image
            }));
            setMilestones(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to load journey API, using fallback data:", err);
      }
    }
    loadJourney();
    return () => { isMounted = false; };
  }, []);

  // Handle URL hash scrolling (e.g. /journey#milestone-5)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, [milestones]);

  // Derive unique years and map each to the first milestone index of that year
  const uniqueYears = [];
  const yearToFirstIndex = {};
  milestones.forEach((milestone, index) => {
    const yearStr = String(milestone.year);
    if (!yearToFirstIndex.hasOwnProperty(yearStr)) {
      yearToFirstIndex[yearStr] = index;
      uniqueYears.push(yearStr);
    }
  });

  const activeYear = String(milestones[activeIndex]?.year || "");

  // IntersectionObserver setup — tracks which milestone card is currently in view
  useEffect(() => {
    const observers = [];

    milestoneRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          root: null,
          rootMargin: "-25% 0px -55% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [milestones]);

  // Auto-scroll mobile pill nav when active index changes
  useEffect(() => {
    const currentYear = String(milestones[activeIndex]?.year || "");
    const uniqueYearIdx = uniqueYears.indexOf(currentYear);
    if (uniqueYearIdx !== -1) {
      const activeBtn = yearButtonRefs.current[uniqueYearIdx];
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex, milestones, uniqueYears]);

  const onYearClick = useCallback((index) => {
    setActiveIndex(index);
    const targetEl = milestoneRefs.current[index];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section id="chronicles" suppressHydrationWarning className="w-full relative z-10 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Title ───────────────────────────────────────────── */}
        <div className="px-4 md:px-6 lg:px-8 mb-8 md:mb-12 text-center lg:text-left">
          <p className="text-xs uppercase tracking-widest text-[#1ebcc7] font-semibold mb-2">
            Historical Archive
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase font-bold text-white tracking-wider">
            The Chronicles of Jey Anand
          </h2>
          <div className="w-16 h-1 bg-[#1ebcc7] mt-4 mx-auto lg:mx-0 rounded-full" />
        </div>

        {/* ── Mobile: horizontal sticky pill bar ─────────────────────── */}
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
                      ? "text-primary border-primary font-bold"
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
              milestones={milestones}
              activeIndex={activeIndex}
              onYearClick={onYearClick}
              yearButtonRefs={yearButtonRefs}
              desktopOnly
            />
          </div>

          {/* Card list — natural vertical flow on all screen sizes */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-5">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id || index}
                id={milestone.id ? `milestone-${milestone.id}` : undefined}
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
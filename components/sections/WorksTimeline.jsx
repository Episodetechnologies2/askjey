"use client";

import Link from 'next/link';
/**
 * WorksTimeline — "Top Works of Jey Anand" horizontal scroll section.
 *
 * Uses GSAP ScrollTrigger with pin:true to create a horizontal scroll
 * carousel driven by vertical page scroll.
 *
 * Comes after JourneyTimeline in the DOM — GSAP handles sequential pinning
 * correctly out of the box.
 */
import { useRef, useEffect, useState } from "react";
;
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchWorks } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

const WorksTimeline = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    async function loadFeaturedWorks() {
      try {
        const data = await fetchWorks({ featured: true });
        if (data) {
          setWorks(data);
        }
      } catch (err) {
        console.error("API error loading featured works:", err);
      }
    }
    loadFeaturedWorks();
  }, []);

  useEffect(() => {
    if (works.length === 0) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getScrollAmount = () => {
        const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const paddingRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
        return -(track.scrollWidth - window.innerWidth + paddingLeft + paddingRight);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.5,
          snap: works.length > 1 ? 1 / (works.length - 1) : 0,
          end: () => {
            const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
            const paddingRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
            return `+=${track.scrollWidth - window.innerWidth + paddingLeft + paddingRight}`;
          },
          invalidateOnRefresh: true,
        },
      });

      gsap.set(track, { force3D: true, willChange: "transform" });
    }, sectionRef);

    return () => ctx.revert();
  }, [works]);

  return (
    <>
      {/* ── Horizontal scroll section ───────────────────────────────── */}
      {works.length > 0 && (
        <section ref={sectionRef} className="relative bg-black overflow-hidden">
          <div className="flex flex-col justify-start w-full py-16 md:py-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-10 w-full">
              <h2 className="flex text-white items-center gap-3 font-display font-bold tracking-tight leading-tight text-[clamp(1.75rem,3.5vw,2.5rem)]">
                <span className="text-primary font-light">|</span>
                WorkFolio
              </h2>
            </div>

            {/* Horizontal track */}
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-8 w-max items-start"
              style={{
                paddingLeft: "max(calc(50vw - 200px), 2rem)",
                paddingRight: "max(calc(50vw - 200px), 2rem)",
              }}
            >
              {works.map((work, index) => (
                <Link
                  key={index}
                  href={`/works/${work.slug}`}
                  className="group relative block w-[260px] md:w-[320px] lg:w-[360px] shrink-0"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] w-full overflow-hidden relative mb-4 lg:mb-0">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Desktop overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent hidden lg:block" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 hidden lg:flex flex-col gap-2 z-10">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight">
                          {work.title}
                        </h3>
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/45 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/15">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="text-white/80 text-sm leading-snug">{work.description}</p>
                    </div>
                  </div>

                  {/* Mobile/tablet below-image text */}
                  <div className="flex flex-col gap-2 lg:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight">
                        {work.title}
                      </h3>
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/15">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-snug">{work.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA block below the scroll section ─────────────────────── */}
      <div className="py-8 md:py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="relative mx-auto overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-12 lg:p-24">
            <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
            <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                Community
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-6xl font-bold uppercase leading-tight">
                <span className="text-white">Join The </span>
                <span className="text-primary">Next Chapter.</span>
              </h2>
              <p className="font-body text-base md:text-lg text-white/70 leading-relaxed">
                Dispatches on design thinking, entrepreneurial experiments, and
                stories from the chronicles of Jey Anand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorksTimeline;

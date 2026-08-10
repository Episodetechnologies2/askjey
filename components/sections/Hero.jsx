"use client";

import { useState, useEffect } from "react";
const jey = '/assets/man.png';
import { CALENDLY_BOOKING_URL } from '@/lib/links';

const TEXTS = ["CREATIVE DIRECTOR", "DESIGN THINKER", "JEY ANAND"];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-black pt-20 lg:pt-24">
      {/* Background Gradient Mesh */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(30, 188, 199, 0.5) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(30, 188, 199, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(50, 200, 220, 0.3) 0%, transparent 80%)
        `,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex w-full flex-col justify-between pt-6 pb-0 lg:py-0 min-h-[calc(100vh-5rem)]">
        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-[50%] xl:max-w-[52%] my-auto pb-4 lg:pb-0">
          <div className="mt-4 mb-4 sm:mt-6 sm:mb-6 flex items-center gap-x-3">
            <div className="h-[2px] w-8 sm:w-12 bg-primary" />
            <span className="font-body text-xs sm:text-sm md:text-md font-semibold uppercase tracking-[0.2em] text-primary">
              Entrepreneur
            </span>
            <div className="h-[2px] w-8 sm:w-12 bg-primary" />
          </div>

          <div className="relative min-h-[90px] sm:min-h-[140px] md:min-h-[180px] lg:min-h-[220px] w-full overflow-hidden flex items-center justify-center lg:justify-start">
            <div key={currentIndex} className="animate-fade-in-up w-full">
              <h1 className="font-display text-[3.2rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold uppercase leading-[0.9] tracking-tight text-white">
                {(() => {
                  const [firstWord, secondWord] =
                    TEXTS[currentIndex].split(" ");

                  return (
                    <>
                      {firstWord}
                      <br />
                      {secondWord}
                    </>
                  );
                })()}
              </h1>
            </div>
          </div>

          <p className="mt-4 sm:mt-6 max-w-lg lg:max-w-xl font-body text-sm sm:text-lg md:text-xl font-light leading-relaxed text-white/70">
            Designing multi-disciplinary ecosystems for brands, talent, and
            communities who crave inventive problem-solving.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-row gap-3 sm:gap-4">
            <a
              href={CALENDLY_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-full bg-primary px-5 py-3 sm:px-8 sm:py-4 font-body text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(30,188,199,0.4)]"
            >
              <span className="relative z-10">Book a Session</span>
            </a>
            <a
              href="/journey"
              className="group relative overflow-hidden rounded-full border border-white/20 px-5 py-3 sm:px-8 sm:py-4 font-body text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-primary hover:text-primary"
            >
              <span className="relative z-10">Explore Journey</span>
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mt-6 mb-0 lg:mt-0 flex justify-center items-end pointer-events-none w-full lg:w-auto lg:absolute lg:right-0 lg:bottom-0 lg:h-[580px] xl:h-[580px] 2xl:h-[760px] lg:items-end lg:justify-end z-0">
          <img
            src={jey}
            alt="Jey Anand"
            className="h-auto w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-none lg:h-full object-contain object-bottom grayscale brightness-105 block"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
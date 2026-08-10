"use client";

import { useRouter } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import WorksTimeline from '@/components/sections/WorksTimeline';
import { Briefcase, Award, Users } from "lucide-react";
import JourneyTimeline from '@/components/sections/JourneyTimeline';

import WorkSection from '@/components/WorkSection';

export default function JourneyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />
          </div>

          <div className="container relative z-10 text-center">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 font-body text-sm uppercase tracking-widest text-primary backdrop-blur-sm">
              Journey
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              Odyssey <span className="text-gradient-gold">Unfolding</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              From cassette hunts to multi-city ventures — design thinking,
              serendipity, and grit across every chapter.
            </p>
          </div>
        </section>

        {/* Stats Strip - clean, minimal */}
        <section className="py-5 border-y border-white/5 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  label: "Years Experience",
                  value: "23YRS",
                  detail: "Design, media, tech, fashion, hospitality",
                  icon: Briefcase,
                },
                {
                  label: "Ventures Launched",
                  value: "12+",
                  detail: "Studios, IPs, products, experiences",
                  icon: Award,
                },
                {
                  label: "Brands Consulted",
                  value: "1000+",
                  detail: "Strategy, scale, storytelling",
                  icon: Users,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/10 bg-white/5 px-5 py-6 flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-display text-3xl text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                      {stat.label}
                    </div>
                    <div className="text-sm text-white/60 leading-snug">
                      {stat.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <JourneyTimeline />
        {/* <WorksTimeline /> */}


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

                {/* CTA Button */}
                <button
                  onClick={() => router.push("/mentorship")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-white"
                >
                  Join Indepreneur Mentorship
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-7-7 7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Work Showcase Section */}
        <WorkSection />

      </main>
      <Footer
        ctaText={{ line1: "Every Journey", line2: "Starts With A Step." }}
      />
    </div>
  );
}

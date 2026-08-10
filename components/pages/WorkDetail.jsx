"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { fetchWork } from '@/lib/api';

export default function WorkDetail() {
  const { slug } = useParams();
  const [work, setWork] = useState(null);

  useEffect(() => {
    async function loadWork() {
      try {
        const data = await fetchWork(slug);
        if (data) {
          setWork(data);
        }
      } catch (err) {
        console.error("API error loading work details:", err);
      }
    }
    loadWork();
  }, [slug]);

  if (!work) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        <Header />
        <main className="container mx-auto px-6 pt-36 pb-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              Portfolio
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">
              Work Not Found
            </h1>
            <p className="mt-5 text-white/70">
              The selected work page is not available right now.
            </p>
            <Link href="/journey"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-wider text-white/90 transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Journey
            </Link>
          </div>
        </main>
        <Footer
          ctaText={{ line1: "Every Journey", line2: "Starts With A Step." }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <Link href="/journey"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs uppercase tracking-wider text-white/90 transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Works
          </Link>

          <div className="grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative min-h-[320px] md:min-h-[520px]">
              <img
                src={work.image}
                alt={work.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
              <p className="text-primary text-xs uppercase tracking-[0.24em]">
                Detailed Portfolio
              </p>
              <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold uppercase leading-tight">
                {work.title}
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed">
                {work.longDescription}
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <p className="mt-8 text-sm md:text-base text-white/65 leading-relaxed">
                {work.description}
              </p>

              <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-3 text-xs uppercase tracking-wider text-primary">
                Explore Case Assets
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Let's Build", line2: "Something Epic." }} />
    </div>
  );
}



"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";

import { ArrowLeft, Calendar, Clock3, ChevronRight } from "lucide-react";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { fetchUpdate, fetchUpdates } from '@/lib/api';

export default function BlogArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticleAndRelated() {
      try {
        setLoading(true);
        const data = await fetchUpdate(slug);
        if (data) {
          setArticle(data);
        } else {
          setArticle(null);
        }

        const allUpdates = await fetchUpdates();
        if (allUpdates) {
          setRelatedArticles(allUpdates.filter((a) => a.slug !== slug).slice(0, 2));
        }
      } catch (err) {
        console.error("API error loading blog article details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticleAndRelated();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        <Header />
        <main className="container mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-bold uppercase text-white animate-pulse">
            Loading article...
          </h1>
          <p className="mt-4 text-white/60">
            Please wait while we retrieve the content.
          </p>
          <Link href="/updates"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-white hover:border-primary hover:text-primary"
          >
            Back to Updates
          </Link>
        </main>
        <Footer ctaText={{ line1: "Ideas Worth", line2: "Spreading." }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        <Header />
        <main className="container mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            Article not found
          </h1>
          <p className="mt-4 text-white/60">
            The article you are looking for does not exist.
          </p>
          <Link href="/updates"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-white hover:border-primary hover:text-primary"
          >
            Back to Updates
          </Link>
        </main>
        <Footer ctaText={{ line1: "Ideas Worth", line2: "Spreading." }} />
      </div>
    );
  }

  const wordCount = (article.body || []).reduce(
    (total, para) => total + para.split(/\s+/).filter(Boolean).length,
    0
  );
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main>
        <section className="relative overflow-hidden pt-32 pb-12">
          <div className="container mx-auto px-6">
            <Link href="/updates"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Updates
            </Link>

            <div className="grid gap-8 rounded-xl border border-white/10 bg-white/5 p-6 md:p-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="inline-block rounded-full border border-white/10 bg-black/30 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  {article.category}
                </span>
                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {article.date}
                  </div>
                  <span className="text-white/30">|</span>
                  <div className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {readMinutes} Min Read
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-white/10">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full max-h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <article className="space-y-7 rounded-xl border border-white/10 bg-white/5 p-7 md:p-10">
                {article.body?.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-body text-base md:text-lg leading-relaxed text-white/85"
                  >
                    {para}
                  </p>
                ))}
              </article>

              <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
                {article.keyTakeaways?.length ? (
                  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-primary">
                      Key Takeaways
                    </h3>
                    <ul className="space-y-3">
                      {article.keyTakeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-white/80"
                        >
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                          <span className="font-body text-sm leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-primary">
                    Continue Reading
                  </h3>
                  <div className="space-y-3">
                    {relatedArticles.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/blogs/${item.slug}`}
                        className="group flex items-start justify-between gap-3 rounded-md border border-white/10 bg-black/30 p-3 transition-colors hover:border-primary/40"
                      >
                        <span className="text-sm leading-relaxed text-white/80 group-hover:text-white">
                          {item.title}
                        </span>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Ideas Worth", line2: "Spreading." }} />
    </div>
  );
}

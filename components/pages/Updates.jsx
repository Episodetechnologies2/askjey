"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
;
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowRight, ArrowUpRight, X, BookOpen, Play } from "lucide-react";
import { fetchUpdates } from '@/lib/api';
import books from '@/lib/data/books.json';
import media from '@/lib/data/media.json';




/* ─── Book Dialog ───────────────────────────────────────────── */
function BookDialog({ book, onClose }) {
  if (!book) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 hover:text-white hover:border-white/30 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-[300px_1fr]">
          {/* Cover */}
          <div className="relative h-56 md:h-auto overflow-hidden">
            <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
            <span className="absolute bottom-5 left-5 inline-block rounded-full border border-primary/40 bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              {book.year}
            </span>
          </div>

          {/* Content */}
          <div className="p-7 md:p-10 flex flex-col justify-center gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/70 mb-2">{book.subtitle}</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight">{book.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/40 uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="font-body text-sm text-white/60 leading-relaxed">{book.fullDescription}</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Author", v: book.coAuthors[0] },
                { l: "Released by", v: book.releasedBy },
                { l: "Pages", v: book.pages },
                { l: "Language", v: book.language },
              ].map(({ l, v }) => (
                <div key={l} className="rounded-xl border border-white/8 bg-white/3 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 mb-1">{l}</p>
                  <p className="text-sm text-white/70 line-clamp-1">{v}</p>
                </div>
              ))}
            </div>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-primary/85 hover:scale-[1.02]">
              <BookOpen className="h-4 w-4" />
              Get the Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function UpdatesPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadUpdates() {
      try {
        const data = await fetchUpdates();
        if (data) {
          setArticles(data);
        }
      } catch (err) {
        console.error("API error loading updates:", err);
      }
    }
    loadUpdates();
  }, []);

  const featuredArticle = articles[0] || {};
  const gridArticles = articles.slice(1, 7); // 6 articles in main grid

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-primary selection:text-black">
      <Header />

      <main className="pt-28 pb-24">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-16">
          <div className="flex items-end justify-between border-b border-white/8 pb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-2">Everything in one place</p>
              <h1 className="font-display text-6xl sm:text-8xl font-bold uppercase leading-none text-white">
                Updates
              </h1>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-white/40 text-right leading-relaxed">
              Writing, published works &amp; conversations — a living record of ideas worth sharing.
            </p>
          </div>
        </div>

        {/* ── Featured Article & Articles Grid ─────────────────── */}
        {articles.length > 0 ? (
          <>
            {/* ── Featured Article ─────────────────────────────────── */}
            <div className="container mx-auto px-6 mb-20">
              <Link href={`/blogs/${featuredArticle.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/8 bg-white/3"
              >
                <div className="grid md:grid-cols-[1fr_420px] min-h-[480px]">
                  {/* Image */}
                  <div className="relative overflow-hidden min-h-[280px]">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 to-transparent md:hidden" />
                  </div>

                  {/* Text */}
                  <div className="relative flex flex-col justify-center p-8 md:p-12">
                    <div className="mb-6">
                      <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                        Latest — {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight text-white group-hover:text-primary transition-colors duration-300">
                      {featuredArticle.title}
                    </h2>
                    <p className="mt-5 text-base text-white/50 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-white/30">{featuredArticle.date}</span>
                      <span className="text-white/15">·</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary">
                        Read
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* ── Articles Grid ─────────────────────────────────────── */}
            <div className="container mx-auto px-6 mb-24">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridArticles.map((article, i) => (
                  <Link
                    key={article.slug}
                    href={`/blogs/${article.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Category chip on image */}
                      <span className="absolute top-3 left-3 inline-block rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                        {article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-bold uppercase leading-tight text-white/90 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm text-white/40 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-widest text-white/25">{article.date}</span>
                        <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-6 mb-24 text-center font-body text-white/40 py-12">
            No updates found.
          </div>
        )}

        {/* ── Divider label ─────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/25">Published Works</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        {/* ── Books ─────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-24">
          <div className="grid gap-5 md:grid-cols-3">
            {books.map((book, i) => (
              <button
                key={book.title}
                onClick={() => setSelectedBook(book)}
                className="group relative flex gap-4 items-start rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* Book cover portrait */}
                <div className="relative shrink-0 w-[80px] h-[108px] overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col h-[108px] justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-1">{book.year}</p>
                    <h3 className="font-display text-base font-bold uppercase leading-tight text-white/90 group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/35 line-clamp-2 leading-relaxed">{book.excerpt}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary/60 group-hover:text-primary transition-colors mt-2">
                    View details
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider label ─────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/25">Appearances</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        {/* ── Media ─────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 mb-20">
          <div className="grid gap-5 md:grid-cols-3">
            {media.map((item, i) => (
              <a
                key={item.title}
                href={item.link}
                className="group relative overflow-hidden rounded-2xl border border-white/8 block hover:border-white/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Kind chip */}
                  <span className="absolute top-3 left-3 inline-block rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {item.kind}
                  </span>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white/80 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                      <Play className="h-5 w-5 fill-white/80 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Text below image */}
                <div className="p-5 bg-white/[0.02]">
                  <h3 className="font-display text-base font-bold uppercase leading-tight text-white/90 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/40 leading-relaxed line-clamp-2">{item.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-white/25">{item.date}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary/60 group-hover:text-primary transition-colors">
                      Watch <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── More articles (remaining) ─────────────────────────── */}
        {articles.length > 7 && (
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <div className="flex items-center gap-6">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/25">More Reading</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>
            </div>
            <div className="grid gap-px border border-white/8 rounded-2xl overflow-hidden">
              {articles.slice(7).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blogs/${article.slug}`}
                  className="group flex items-center gap-5 bg-white/[0.02] hover:bg-white/[0.05] px-6 py-5 transition-colors"
                >
                  <div className="shrink-0 w-14 h-12 overflow-hidden rounded-lg">
                    <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">{article.category}</span>
                    <h3 className="font-display text-base font-bold uppercase leading-tight text-white/80 group-hover:text-white transition-colors line-clamp-1 mt-0.5">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:block text-[11px] uppercase tracking-widest text-white/25">{article.date}</span>
                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer ctaText={{ line1: "Ideas Worth", line2: "Spreading." }} />
      <BookDialog book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

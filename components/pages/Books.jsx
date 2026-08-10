"use client";

import { useState, useEffect } from "react";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { BookOpen, ArrowRight, X } from "lucide-react";
import publishedBooks from "@/lib/data/books.json";

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState(null);

  // Disable scroll when dialog is open
  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBook]);

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
              Publications
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              Books & <span className="text-gradient-gold">Works</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              Discover published works that blend naval history, strategic
              thinking, and design philosophy. Each volume crafted to inspire,
              inform, and illuminate the path from vision to legacy.
            </p>
          </div>
        </section>

        {/* Books Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {publishedBooks.map((book, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-primary/60 hover:bg-white/10"
                >
                  <div className="absolute inset-0 opacity-40 pointer-events-none bg-black/10" />

                  {/* Book Image Preview */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60" />
                    <div className="absolute top-4 right-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/60 backdrop-blur-sm text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        {book.year}
                      </span>
                    </div>
                  </div>

                  <div className="relative p-8">
                    <div className="mb-4">
                      <span className="block font-display text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">
                        {book.subtitle}
                      </span>
                      <span className="block font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                        {book.title}
                      </span>
                    </div>

                    <p className="mt-4 font-body text-base text-white/70 leading-relaxed line-clamp-3">
                      {book.description || book.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {book.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBook(book)}
                    className="relative mt-8 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/60 px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-primary/70 hover:text-primary"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Details Dialog - Full Screen */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-6">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="fixed right-6 top-6 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/80 backdrop-blur-sm text-white hover:text-primary hover:border-primary hover:bg-white/10 transition-all"
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="w-full max-w-6xl">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left Side - Image and Details */}
                <div className="space-y-5">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 max-w-sm mx-auto">
                    <img
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Year Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="inline-block rounded-full border border-primary/40 bg-primary/20 backdrop-blur-sm px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary">
                        {selectedBook.year}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Authors
                      </div>
                      <div className="font-body text-sm text-white/80 line-clamp-1">
                        {selectedBook.coAuthors[0]}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Released By
                      </div>
                      <div className="font-body text-sm text-white/80 line-clamp-1">
                        {selectedBook.releasedBy}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Pages
                      </div>
                      <div className="font-body text-sm text-white/80">
                        {selectedBook.pages}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Language
                      </div>
                      <div className="font-body text-sm text-white/80">
                        {selectedBook.language}
                      </div>
                    </div>
                  </div>

                  {/* Buy Now Button */}
                  <button className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 font-body text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-primary/80">
                    <BookOpen className="h-5 w-5" />
                    Buy Now
                  </button>
                </div>

                {/* Right Side - Title, Tags, and About */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                        <BookOpen className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
                          {selectedBook.subtitle}
                        </div>
                        <h1 className="font-display text-3xl lg:text-5xl font-bold text-white leading-tight mt-2">
                          {selectedBook.title}
                        </h1>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* About the Book */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-primary mb-3">
                      About the Book
                    </h2>
                    <p className="font-body text-base text-white/80 leading-relaxed">
                      {selectedBook.fullDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Section */}
        <section className="border-t border-white/10 bg-black py-32">
          <div className="container mx-auto px-6 text-center">
            <p className="mx-auto max-w-4xl font-display text-4xl font-bold uppercase leading-tight text-white lg:text-6xl">
              "Every book is a conversation with someone who has mastered
              something you haven't."
            </p>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Knowledge Is", line2: "Power." }} />
    </div>
  );
}

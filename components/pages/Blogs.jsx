import Link from 'next/link';
;
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowRight, Calendar } from "lucide-react";
import { articles } from '@/lib/data/articles';

export default function BlogsPage() {
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
              The Journal
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              The <span className="text-gradient-gold">Editorial</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              Deep insights, real stories, and hard-won lessons on design
              thinking, entrepreneurship, and the relentless pursuit of
              excellence across every venture.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className={`group relative flex flex-col gap-8 ${
                    index === 0
                      ? "lg:col-span-2 lg:flex-row lg:items-center"
                      : ""
                  }`}
                >
                  <Link href={`/blogs/${article.slug}`}
                    className={`relative overflow-hidden ${
                      index === 0 ? "lg:w-1/2" : "w-full"
                    }`}
                  >
                    <div className="aspect-4/3 w-full overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div
                    className={`flex flex-col justify-center ${
                      index === 0 ? "lg:w-1/2" : "w-full"
                    }`}
                  >
                    <div className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-white/40">
                      <span className="text-primary">{article.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </div>
                    </div>

                    <h2
                      className={`font-display font-bold uppercase leading-none text-white group-hover:text-primary transition-colors ${
                        index === 0 ? "text-5xl lg:text-7xl" : "text-4xl"
                      }`}
                    >
                      <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="mt-6 font-body text-lg text-white/60">
                      {article.excerpt}
                    </p>

                    <div className="mt-8">
                      <Link href={`/blogs/${article.slug}`}
                        className="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-widest text-white transition-colors group-hover:text-primary"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Ideas Worth", line2: "Spreading." }} />
    </div>
  );
}

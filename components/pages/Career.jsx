import Link from 'next/link';
;
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowUpRight, Users, Zap, Globe } from "lucide-react";
import positions from '@/lib/data/careerPositions.json';

export default function CareerPage() {


  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[650px] w-[650px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/10 blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-[650px] w-[650px] translate-y-1/2 -translate-x-1/3 rounded-full bg-white/5 blur-[140px]" />
          </div>

          <div className="container relative z-10 text-center">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 font-body text-sm uppercase tracking-widest text-primary backdrop-blur-sm">
              Join the Team
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              Build with <span className="text-gradient-gold">Impact</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              Join a creative lab for problem solvers and storytellers. If you
              crave inventive challenges, cross-disciplinary work, and the
              opportunity to shape ventures that matter, we want to hear from
              you.
            </p>
          </div>
        </section>

        {/* Culture Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="border border-white/10 bg-white/5 p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black border border-white/10 text-primary">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Impact First
                </h3>
                <p className="mt-4 font-body text-white/60">
                  We don't just build things; we solve problems that matter.
                </p>
              </div>
              <div className="border border-white/10 bg-white/5 p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black border border-white/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Radical Collab
                </h3>
                <p className="mt-4 font-body text-white/60">
                  No silos. Designers talk to engineers. Everyone talks to
                  users.
                </p>
              </div>
              <div className="border border-white/10 bg-white/5 p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black border border-white/10 text-primary">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Global Mindset
                </h3>
                <p className="mt-4 font-body text-white/60">
                  Our team spans continents, cultures, and time zones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 font-display text-4xl font-bold uppercase text-white lg:text-6xl">
              Open Positions
            </h2>

            <div className="space-y-4">
              {positions.map((job, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden border border-white/10 bg-white/5 p-6 md:p-8 transition-all hover:border-primary/60 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold uppercase text-white">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
                        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">
                          {job.department}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">
                          {job.type}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">
                          {job.location}
                        </span>
                      </div>
                    </div>

                    <Link href="/contact"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black text-white transition-colors group-hover:bg-primary group-hover:text-black"
                    >
                      <ArrowUpRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="font-body text-lg text-white/60">
                Don't see your role?{" "}
                <a
                  href="mailto:askjey.official@gmail.com"
                  className="font-bold text-primary hover:underline"
                >
                  Email us
                </a>{" "}
                your portfolio.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Join The", line2: "Mission." }} />
    </div>
  );
}

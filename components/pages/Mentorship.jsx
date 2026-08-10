import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import EditorialTestimonials from '@/components/sections/EditorialTestimonials';
import {
  CheckCircle2,
  ArrowUpRight,
  Brain,
  Lightbulb,
  Users,
} from "lucide-react";

export default function MentorshipPage() {
  const programs = [
    {
      title: "Brain Monkey",
      duration: "6 Months",
      icon: Brain,
      link: "/mentorship/brain-monkey",
      description:
        "Master the art of creative problem-solving and innovative thinking. Learn to approach challenges with a fresh perspective and develop breakthrough solutions.",
      features: [
        "Creative thinking frameworks",
        "Problem-solving strategies",
        "Innovation workshops",
      ],
    },
    {
      title: "Indepreneur",
      duration: "6 Months",
      icon: Lightbulb,
      link: "/mentorship/indepreneur",
      description:
        "Bridge the gap between independence and entrepreneurship. Build your personal brand while developing business acumen and entrepreneurial skills.",
      features: [
        "Personal brand development",
        "Business model creation",
        "Revenue generation strategies",
      ],
    },
    {
      title: "Jelly Creators United",
      duration: "12 Months",
      icon: Users,
      link: "/mentorship/jelly-creators-united",
      description:
        "Join a community of creators and innovators. Collaborate, learn, and grow together through shared experiences and collective wisdom.",
      features: [
        "Community networking events",
        "Collaborative projects",
        "Peer mentorship program",
      ],
    },
  ];

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
              Exclusive Programs
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              Inner <span className="text-gradient-gold">Circle</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              Join an exclusive community of innovators, entrepreneurs, and
              creative leaders. Access mentorship programs designed to
              accelerate growth, unlock potential, and transform vision into
              reality.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:border-primary/50 hover:bg-white/10"
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-black border border-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-black">
                    <program.icon className="h-7 w-7" />
                  </div>

                  <h3 className="font-display text-3xl font-bold uppercase text-white">
                    {program.title}
                  </h3>
                  <div className="mt-2 font-body text-sm font-bold uppercase tracking-wider text-primary">
                    {program.duration}
                  </div>

                  <p className="mt-6 font-body text-white/60">
                    {program.description}
                  </p>

                  <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
                    {program.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-white/80"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-4 font-body text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-primary hover:text-black"
                  >
                    Know More
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <EditorialTestimonials />
      </main>
      <Footer ctaText={{ line1: "Unlock Your", line2: "Potential." }} />
    </div>
  );
}

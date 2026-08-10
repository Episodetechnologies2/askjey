"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
;
import { ArrowUpRight, Award, Briefcase, Users } from "lucide-react";
import CountUp from "react-countup";

const stats = [
  { label: "Years Experience", value: 23, suffix: "YRS", icon: Briefcase },
  { label: "Ventures Launched", value: 12, suffix: "+", icon: Award },
  {
    label: "Brands Consulted",
    value: 1000,
    suffix: "+",
    icon: Users,
  },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setStartCount(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Reset startCount when component unmounts or section becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setStartCount(false);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative bg-black py-24 text-white">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: Title & Stats */}
          <div
            className={`space-y-12 transition-all duration-1000 ${isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
              }`}
          >
            <div>
              <h2 className="font-display text-5xl font-bold uppercase leading-none text-white lg:text-7xl">
                The <span className="text-primary">Architect</span> <br />
                of Ideas
              </h2>
              <div className="mt-6 h-1 w-24 bg-primary" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-panel group p-6 transition-all hover:border-primary/50"
                >
                  <stat.icon className="mb-4 h-8 w-8 text-primary opacity-80 group-hover:opacity-100" />
                  <h3 className="font-display text-4xl font-bold text-white">
                    {startCount ? (
                      <span>
                        <CountUp
                          key={`countup-${index}-${startCount}`}
                          start={0}
                          end={stat.value}
                          duration={2.5}
                          delay={index * 0.2}
                          separator=","
                          decimals={0}
                          enableScrollSpy={false}
                        />
                        {stat.format === "k" ? "k" : ""}
                        {stat.suffix}
                      </span>
                    ) : (
                      <span>
                        0{stat.format === "k" ? "k" : ""}
                        {stat.suffix}
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 font-body text-sm font-medium uppercase tracking-wider text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bio & CTA */}
          <div
            className={`space-y-8 transition-all delay-300 duration-1000 ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            <div className="space-y-6 font-body text-base leading-relaxed text-white/70">
              <p>
                In the electrifying world of branding, where ideas ignite
                revolutions, I am the architect behind icons like Suguna Chicken,
                The Chennai Silks, Wondr Diamonds, Asian Paints, Boomerang,
                MRF Racing, Roots, Pricol, LMW, Decathlon, the Indian Navy etc.,
                I don't just consult.. I transform, forging brands that throb with life,
                captivate hearts, and stand eternal.
              </p>
              <p>
                Entrepreneurship fuels me, a steady path of thoughtful risks,
                persistent effort, and quiet growth, where success emerges from
                dedication. My ventures form the heart of my journey, each one a
                humble step in the thrill of building something meaningful. I have
                founded several ventures that drive my passion for
                entrepreneurship, each a modest effort to create real value.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/journey"
                className="group inline-flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-white transition-colors hover:text-primary"
              >
                Read Full Story
                <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

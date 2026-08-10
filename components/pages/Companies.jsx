"use client";

import { useState, useRef, useEffect } from "react";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowUpRight, Building2, Calendar, Tag, X } from "lucide-react";
import companies from '@/lib/data/companies.json';

// Import local company logos
const enixelLogo = '/assets/company/enixel.png';
const episodeLogo = '/assets/company/Episode.png';
const happyLogo = '/assets/company/happy.webp';
const justKitchenLogo = '/assets/company/just kitchen.png';
const karnivalLogo = '/assets/company/karnival.png';
const konzeptLogo = '/assets/company/konzept.webp';
const pingleLogo = '/assets/company/pingle.png';
const stageSightLogo = '/assets/company/stage sight.png';
const zamindarLogo = '/assets/company/zamindar.png';
const tentellectLogo = '/assets/company/tentellect.png';
const odakaLogo = '/assets/company/odaka.png';
const zircleLogo = '/assets/company/zircle.png';


// Map company IDs to their local images
const companyImages = {
  happylabs: happyLogo,
  episode: episodeLogo,
  stagesight: stageSightLogo,
  enixel: enixelLogo,
  konzept: konzeptLogo,
  karnival: karnivalLogo,
  pingle: pingleLogo,
  justkitchen: justKitchenLogo,
  zamindarkitchen: zamindarLogo,
  tentellect: tentellectLogo,
  odaka: odakaLogo,
  zircle: zircleLogo,
};

/* ── Stat counter ─────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Company Detail Modal ─────────────────────────────────────────────── */
function CompanyModal({ company, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!company) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 sm:p-6 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="sticky top-3 ml-auto mr-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0a]/90 backdrop-blur-sm text-white/50 hover:text-white hover:border-white/30 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-[1fr_1.1fr] -mt-9">
          {/* Image */}
          <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[300px] overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            <img
              src={companyImages[company.id] || company.image}
              alt={company.fullName}
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={{ objectPosition: 'center' }}
            />
            <div className="absolute inset-0 " />
            {/* Year badge */}
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Calendar className="h-3 w-3" />
              Est. {company.founded}
            </span>
            {/* Status badge */}
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {company.status}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-7 md:p-9 flex flex-col justify-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70 mb-1.5">
                {company.sector}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white leading-none mb-1">
                {company.name}
              </h2>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 font-body hover:text-primary transition-colors duration-300 hover:underline inline-block"
              >
                {company.fullName}
              </a>
            </div>

            <blockquote className="border-l-2 border-primary/50 pl-3">
              <p className="text-sm text-white/70 italic font-body leading-relaxed">
                "{company.tagline}"
              </p>
            </blockquote>

            <p className="font-body text-sm text-white/55 leading-relaxed">
              {company.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Founded", value: company.founded },
                { label: "Status", value: company.status },
                { label: "Sector", value: company.sector },
                { label: "Venture", value: company.fullName },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/8 bg-white/3 px-3 py-2.5"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary/60 mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-white/70 font-body truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Company Card ─────────────────────────────────────────────────────── */
function CompanyCard({ company, index, onClick }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${(index % 3) * 80}ms`,
      }}
    >
      <button
        onClick={() => onClick(company)}
        className="group relative w-full text-left overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0A0A0A] hover:border-[rgba(0,255,200,0.2)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer"
      >
        {/* Banner Image Header */}
        <div className="relative w-full h-[220px] overflow-hidden rounded-t-2xl">
          <img
            src={companyImages[company.id] || company.image}
            alt={company.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 z-0"
            loading="lazy"
            style={{ objectPosition: 'center' }}
          />
          
          {/* Gradient overlay only for bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          
          {/* Category Badge - Top Left */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70 z-20">
            <Tag className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            {company.sector}
          </span>
          
          {/* Year Badge - Top Right */}
          <span className="absolute top-3 right-3 inline-block rounded-full border border-primary/30 bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary z-20">
            {company.founded}
          </span>
          

          {/* Arrow Icon - Bottom Right */}
          <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(0,255,200,0.4)] bg-[rgba(0,255,200,0.05)] shadow-[0_0_10px_rgba(0,255,200,0.4)] text-[#00FFC6] opacity-0 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-[rgba(0,255,200,0.15)] group-hover:shadow-[0_0_15px_rgba(0,255,200,0.7)] transition-all duration-300 z-20">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-5 flex flex-col gap-[6px]">
          {/* Title */}
          <h3 className="text-[18px] font-bold text-white tracking-[0.5px] mb-1">
            {company.name}
          </h3>
          
          {/* Subtitle */}
          <p className="text-[11px] uppercase tracking-[1px] text-[#6B7280]">
            {company.fullName}
          </p>
          
          {/* Description */}
          <p className="text-[14px] text-[#9CA3AF] leading-[1.5] mt-1 line-clamp-2">
            {company.tagline}
          </p>

          {/* Active Button */}
          <div className="mt-3 inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-[rgba(0,255,200,0.06)] border border-[rgba(0,255,200,0.2)] text-[#00FFC6] text-[12px] font-medium w-fit">
            <span className="w-[6px] h-[6px] rounded-full bg-[#00FFC6]" />
            {company.status}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ── Stats strip ──────────────────────────────────────────────────────── */
function StatsStrip() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const ventures = useCountUp(12, 1000, started);
  const years = useCountUp(23, 1200, started);
  const sectors = useCountUp(8, 900, started);

  const stats = [
    { value: ventures, suffix: "+", label: "Ventures" },
    { value: years, suffix: "yrs", label: "Building" },
    { value: sectors, suffix: "+", label: "Industries" },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8 mb-10 sm:mb-16 lg:mb-20"
    >
      {stats.map(({ value, suffix, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center py-6 sm:py-8 px-2 sm:px-4 bg-[#080808] text-center"
        >
          <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none">
            {value}{suffix}
          </span>
          <span className="mt-1.5 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white/40 font-body">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filter, setFilter] = useState("All");

  const sectors = ["All", ...Array.from(new Set(companies.map((c) => c.sector)))];

  const filtered =
    filter === "All" ? companies : companies.filter((c) => c.sector === filter);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white selection:bg-primary selection:text-black">
      <Header />

      <main className="pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24">

        {/* ── Page Hero ──────────────────────────────────────────────── */}
        <div className="container mx-auto pt-8 px-4 sm:px-6 mb-10 sm:mb-14 lg:mb-16 relative">
          {/* Background glow — clipped so it never overflows horizontally */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/8 blur-[140px]" />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-primary mb-3 sm:mb-4">
              The Ventures of Jey Anand
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-5 border-b border-white/8 pb-6 sm:pb-10">
              <h1 className="font-display text-[clamp(3rem,14vw,9rem)] font-bold uppercase leading-none text-white">
                Companies
              </h1>
             <p className="max-w-sm sm:max-w-md text-xs sm:text-sm text-white/40 font-body leading-relaxed md:text-right">
              Over two decades of building, launching, and scaling ventures
              <br />
              across design, technology, F&amp;B, manufacturing, and media.
            </p>  
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6">
          <StatsStrip />
        </div>

        {/* ── Filter tabs ────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  filter === s
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Companies Grid ─────────────────────────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company, i) => (
              <CompanyCard
                key={company.id}
                company={company}
                index={i}
                onClick={setSelectedCompany}
              />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="h-10 w-10 text-white/15 mb-4" />
              <p className="text-white/40 font-body text-sm">No ventures in this sector yet.</p>
            </div>
          )}
        </div>

        {/* ── Timeline ribbon ────────────────────────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6 mt-16 sm:mt-20 lg:mt-24">
          <div className="border border-white/8 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/8 flex items-center gap-3">
              <span className="text-primary font-light text-xl sm:text-2xl font-display">|</span>
              <h2 className="font-display text-base sm:text-xl font-bold uppercase text-white tracking-wider">
                Venture Timeline
              </h2>
            </div>

            {/* Timeline rows */}
            <div className="divide-y divide-white/5">
              {[...companies]
                .sort((a, b) => parseInt(a.founded) - parseInt(b.founded))
                .map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="group w-full flex items-center gap-3 sm:gap-5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 text-left"
                  >
                    {/* Year */}
                    <span className="shrink-0 font-display text-lg sm:text-2xl font-bold text-primary/60 group-hover:text-primary transition-colors w-12 sm:w-16">
                      {company.founded}
                    </span>

                    {/* Connector dot */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full border border-primary/40 bg-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm sm:text-base font-bold uppercase text-white/80 group-hover:text-white transition-colors truncate">
                        {company.fullName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/35 font-body mt-0.5 truncate">
                        {company.tagline}
                      </p>
                    </div>

                    {/* Sector — hidden on xs, shown from sm */}
                    <span className="hidden sm:inline-block shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:border-primary/30 group-hover:text-primary/70 transition-all max-w-[90px] truncate">
                      {company.sector}
                    </span>

                    <ArrowUpRight className="shrink-0 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/20 group-hover:text-primary transition-colors" />
                  </button>
                ))}
            </div>
          </div>
        </div>

      </main>

      <Footer ctaText={{ line1: "Build the", line2: "Future." }} />

      {/* Detail modal */}
      <CompanyModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
}

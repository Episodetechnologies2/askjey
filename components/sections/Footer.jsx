"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

const servicesLinks = [
  { name: "Entrepreneurial Leadership", href: "/booking" },
  { name: "Business Acceleration",      href: "/booking" },
  { name: "Enterprise Thinking",        href: "/booking" },
  { name: "Startup Foundations",        href: "/mentorship" },
  { name: "Career Coaching",            href: "/mentorship" },
  { name: "Motivational Talks",         href: "/booking" },
];

const quickLinks = [
  { name: "Booking", href: "/booking" },
  { name: "Journey", href: "/journey" },
  { name: "Mentorship", href: "/mentorship" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

const Footer = ({
  ctaText = { line1: "Let's Build", line2: "Something Epic." },
}) => {
  const { settings } = useSettings();
  const logo = settings?.logo_url || "/assets/logo.svg";
  const copyright = settings?.footer_content || `© ${new Date().getFullYear()} Ask Jey Anand. All rights reserved.`;

  const socialLinks = [
    {
      name: "Instagram",
      href: settings?.social_links?.instagram || "https://www.instagram.com/ask.jey/",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: settings?.social_links?.facebook || "https://www.facebook.com/profile.php?id=61584621863116",
      icon: Facebook,
    },
    {
      name: "LinkedIn",
      href: settings?.social_links?.linkedin || "https://www.linkedin.com/in/askjey/",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      href: settings?.social_links?.youtube || "https://www.youtube.com/@ask-jey",
      icon: Youtube,
    },
    {
      name: "X",
      href: settings?.social_links?.twitter || "https://x.com/AskJeyAnand",
      icon: Twitter,
    },
  ];

  return (
    <footer className="relative bg-black pt-24 pb-12 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Top Section: CTA */}
        <div className="mb-20 border-b border-white/10 pb-20">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <h2 className="font-display text-6xl font-bold uppercase leading-none lg:text-8xl">
              {ctaText.line1} <br />
              <span className="text-gradient-gold">{ctaText.line2}</span>
            </h2>
            <Link
              href="/contact"
              className="group flex h-32 w-32 items-center justify-center rounded-full bg-white transition-all duration-500 hover:scale-110 hover:bg-primary"
            >
              <ArrowUpRight className="h-12 w-12 text-black transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 block group">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Ask Jey monogram"
                  className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-maheni text-xl sm:text-4xl tracking-wider text-white">
                  askjey
                </span>
              </div>
            </Link>
            <p className="font-body text-sm text-white/50 whitespace-pre-line">
              {copyright}
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-4">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
              Connect
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-primary hover:bg-primary hover:text-black"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="font-body text-xs text-white/40 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="font-body text-xs text-white/40 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

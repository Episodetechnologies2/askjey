"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import { useSettings } from "@/components/SettingsProvider";

import {
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
const logo = '/assets/logo.svg';

const navLinks = [
  { href: "/companies", label: "Companies" },
  { href: "/booking", label: "Booking" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/journey", label: "Journey" },
  { href: "/updates", label: "Updates" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const websiteName = settings?.website_name || "askjey";
  const websiteLogo = settings?.logo_url || logo;

  const socialLinks = [
    {
      href: settings?.social_links?.instagram || "https://www.instagram.com/ask.jey/",
      icon: Instagram,
      name: "Instagram",
    },
    { href: settings?.social_links?.twitter || "https://x.com/AskJeyAnand", icon: Twitter, name: "X" },
    {
      href: settings?.social_links?.facebook || "https://www.facebook.com/profile.php?id=61584621863116",
      icon: Facebook,
      name: "Facebook",
    },
    {
      href: settings?.social_links?.linkedin || "https://www.linkedin.com/in/askjey/",
      icon: Linkedin,
      name: "LinkedIn",
    },
    {
      href: settings?.social_links?.youtube || "https://www.youtube.com/@ask-jey",
      icon: Youtube,
      name: "YouTube",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-screen ${scrolled
            ? "py-3 sm:py-4 bg-black/80 backdrop-blur-xl border-b border-white/5"
            : "py-4 sm:py-6 bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Homepage" className="relative z-50 group">
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

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-x-8 bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : !link.external && pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white/80 transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(30,188,199,0.5)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}
                        className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(30,188,199,0.5)] ${isActive
                            ? "text-primary drop-shadow-[0_0_8px_rgba(30,188,199,0.5)]"
                            : "text-white/80"
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-x-6">
            <div className="hidden items-center gap-x-5 lg:flex">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-white/60 transition-all duration-300 hover:text-primary hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="text-white hover:text-primary transition-colors"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl transition-all duration-500 ${isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="text-white/60 hover:text-primary transition-colors"
          >
            <X size={40} />
          </button>
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-y-6 px-6 pt-10">
          {navLinks.map((link, idx) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : !link.external && pathname.startsWith(link.href);
            return (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-3xl text-white/90 transition-all duration-300 hover:scale-105 hover:text-primary sm:text-4xl"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-display text-3xl sm:text-4xl transition-all duration-300 hover:scale-105 ${isActive
                      ? "text-primary drop-shadow-[0_0_12px_rgba(30,188,199,0.6)]"
                      : "text-white/90 hover:text-primary"
                    }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.label}
                </Link>
              )
            );
          })}

          <div className="mt-6 flex gap-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-white/60 transition-all duration-300 hover:text-primary hover:scale-110"
              >
                <social.icon className="h-7 w-7" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

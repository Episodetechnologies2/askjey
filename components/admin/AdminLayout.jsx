"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Settings as SettingsIcon,
  User,
  Menu,
  X,
  Database,
  Bell,
  ChevronDown,
  LogOut
} from 'lucide-react';
import api from '@/lib/adminApi';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        try {
          setAdminUser(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing adminUser from localStorage:', e);
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error('Logout error:', e);
    }
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Works', path: '/admin/works', icon: Briefcase },
    { name: 'Updates', path: '/admin/updates', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
    { name: 'Profile', path: '/admin/profile', icon: User }
  ];

  const getCurrentPageName = () => {
    const item = menuItems.find(i => pathname.startsWith(i.path));
    return item ? item.name : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex">
      {/* ─── DESKTOP SIDEBAR ───────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#171717] border-r border-[rgba(255,255,255,.08)] py-8 px-6 h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <img
            src="/assets/logo.svg"
            alt="Ask Jey monogram"
            className="h-10 w-auto"
          />
          <div>
            <h1 className="font-maheni text-2xl tracking-wider text-white leading-none">askjey</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-body mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-[12px] font-body text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-[#1ebcc7]' : 'text-white/60 hover:text-white/90 hover:bg-white/[0.02]'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-[#1ebcc7]/5 border-l-2 border-[#1ebcc7] rounded-[12px]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 z-10 ${isActive ? 'text-[#1ebcc7]' : 'text-white/40'}`} />
                <span className="z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom of sidebar */}
        <div className="mt-auto border-t border-[rgba(255,255,255,.08)] pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-4 py-3.5 rounded-[12px] font-body text-sm font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-400/60" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* ─── MOBILE DRAWER SIDEBAR ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#171717] border-r border-[rgba(255,255,255,.08)] py-8 px-6 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/logo.svg"
                    alt="Ask Jey monogram"
                    className="h-10 w-auto"
                  />
                  <div>
                    <h1 className="font-maheni text-2xl tracking-wider text-white leading-none">askjey</h1>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Admin Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md border border-white/10 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-4 px-4 py-3.5 rounded-[12px] font-body text-sm font-semibold uppercase tracking-wider ${isActive ? 'text-[#1ebcc7]' : 'text-white/60 hover:text-white'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-[#1ebcc7]/5 border-l-2 border-[#1ebcc7] rounded-[12px]" />
                      )}
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#1ebcc7]' : 'text-white/40'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-[rgba(255,255,255,.08)] pt-6 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 px-4 py-3.5 rounded-[12px] font-body text-sm font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-red-400/60" />
                  <span>Log Out</span>
                </button>
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-[#0E0E0E]/80 backdrop-blur-md border-b border-[rgba(255,255,255,.08)] h-20 px-6 lg:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md border border-white/10 text-white/70 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-white font-display text-xl uppercase tracking-wider hidden sm:block">
              {getCurrentPageName()}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            {/* <button className="relative p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[#1ebcc7]/30 transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#1ebcc7] rounded-full" />
            </button> */}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-full border border-white/10 bg-[#171717]/60 hover:border-[#1ebcc7]/30 transition-all cursor-pointer"
              >
                <img
                  src={adminUser.avatarUrl || '/assest/avatar icon.png'}
                  alt={adminUser.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-xs font-semibold px-1 text-white/80">{adminUser.name || 'Admin'}</span>
                <ChevronDown className="w-4 h-4 text-white/40 hidden md:block" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[16px] shadow-lg p-2 z-20"
                    >
                      <Link href="/admin/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.02] rounded-[10px]"
                      >
                        <User className="w-4 h-4 text-white/40" />
                        <span>My Profile</span>
                      </Link>
                      <Link href="/admin/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.02] rounded-[10px]"
                      >
                        <SettingsIcon className="w-4 h-4 text-white/40" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-white/[0.02] rounded-[10px] text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400/60" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
;
import toast from 'react-hot-toast';
import {
  Briefcase,
  FileText,
  Clock,
  Plus,
  Database,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import api from '@/lib/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error('Could not load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-white/40">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Works (Portfolio)',
      icon: Briefcase,
      total: stats?.works?.total || 0,
      published: stats?.works?.published || 0,
      draft: stats?.works?.draft || 0,
      color: '#1ebcc7'
    },
    {
      title: 'Updates (Articles)',
      icon: FileText,
      total: stats?.updates?.total || 0,
      published: stats?.updates?.published || 0,
      draft: stats?.updates?.draft || 0,
      color: '#a855f7'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider font-bold">System Status</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Overview of AskJey CMS Content</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#171717]/60 text-xs font-semibold uppercase tracking-wider text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>System Online</span>
        </div>
      </div>

      {/* ─── STATISTICS CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <div>
                  <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">{card.title}</h3>
                  <h2 className="font-display text-5xl font-bold mt-1 group-hover:text-[#1ebcc7] transition-colors">{card.total}</h2>
                </div>
              </div>

              <div className="flex gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 w-full md:w-auto">
                <div className="flex-1 md:flex-initial bg-black/30 border border-white/5 rounded-xl px-4 py-2 text-center md:text-left min-w-[90px]">
                  <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">Published</p>
                  <p className="text-xl font-bold mt-0.5">{card.published}</p>
                </div>
                <div className="flex-1 md:flex-initial bg-black/30 border border-white/5 rounded-xl px-4 py-2 text-center md:text-left min-w-[90px]">
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Drafts</p>
                  <p className="text-xl font-bold mt-0.5">{card.draft}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 space-y-4">
        <h3 className="font-display text-lg uppercase tracking-wider font-bold">Quick Administration Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/works?action=new"
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:border-[#1ebcc7]/30 hover:bg-[#1ebcc7]/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:text-[#1ebcc7] group-hover:border-[#1ebcc7]/30 transition-all mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Add New Work</span>
          </Link>

          <Link href="/admin/updates?action=new"
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-black/20 hover:border-[#1ebcc7]/30 hover:bg-[#1ebcc7]/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:text-[#1ebcc7] group-hover:border-[#1ebcc7]/30 transition-all mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Add New Update</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ─── RECENT AUDIT LOGS ─── */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 space-y-4 overflow-hidden flex flex-col h-[420px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1ebcc7]" />
              <h3 className="font-display text-lg uppercase tracking-wider font-bold">Activity Audit Logs</h3>
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Latest 10 items</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((log) => (
                <div key={log.id} className="p-3 bg-black/25 border border-white/5 rounded-xl flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold uppercase tracking-wider text-white/70">
                      {log.action}
                    </span>
                    <p className="text-white/80 font-semibold">{log.details}</p>
                    <p className="text-[9px] text-white/30 font-semibold">
                      BY: {log.admin_name || 'System'} {log.ip_address ? `(${log.ip_address})` : ''}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 shrink-0 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/30 text-xs">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <span>No activities recorded yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/adminApi';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Establish NextAuth session cookie for middleware protection
      const nextAuthResult = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      });

      if (nextAuthResult?.error) {
        toast.error(nextAuthResult.error);
        setLoading(false);
        return;
      }

      // 2. Fetch JWT token and admin details for localStorage compatibility
      const response = await api.post('/login', {
        username: data.username,
        password: data.password
      });
      
      const { token, admin } = response.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      
      toast.success('Successfully logged in!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.error || 'Failed to authenticate. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0E0E0E] flex items-center justify-center p-6 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#1ebcc7]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#1ebcc7]/3 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#171717]/60 backdrop-blur-md border border-[rgba(255,255,255,.08)] rounded-[24px] p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Logo and Titles */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/logo.svg"
              alt="Ask Jey monogram"
              className="h-12 w-auto"
            />
            <h1 className="font-maheni text-4xl tracking-wider text-white">askjey</h1>
          </div>
          <h1 className="font-display text-2xl uppercase tracking-wider font-bold mb-2">Admin Portal</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-body">Secure Content Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Askjey"
                className={`w-full bg-white/[0.03] border ${errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#1ebcc7]'} rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all`}
                {...register('username', { 
                  required: 'Username is required'
                })}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs font-semibold mt-1 px-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Password</label>
              <button 
                type="button" 
                onClick={() => toast('Please contact the system administrator to reset password.', { icon: '🔑' })}
                className="text-[10px] uppercase tracking-wider text-white/40 hover:text-[#1ebcc7] transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#1ebcc7]'} rounded-[16px] py-3.5 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all`}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-semibold mt-1 px-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/[0.02] text-[#1ebcc7] focus:ring-[#1ebcc7] focus:ring-offset-0 accent-[#1ebcc7]"
                defaultChecked
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 hover:text-white/70 transition-colors">
                Remember Me
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-semibold uppercase tracking-wider text-sm py-4 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(30,188,199,0.3)] mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

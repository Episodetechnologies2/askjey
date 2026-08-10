"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { User, Loader2, Save, Camera, Globe, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import api from "@/lib/adminApi";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    avatar_url: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfile({
          name: response.data.name || "",
          username: response.data.username || "",
          avatar_url: response.data.avatar_url || ""
        });
      } catch (e) {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    const uploadToast = toast.loading("Uploading avatar image...");
    try {
      const response = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { url } = response.data;
      setProfile((prev) => ({ ...prev, avatar_url: url }));
      toast.success("Avatar image uploaded successfully!", { id: uploadToast });
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Failed to upload avatar image", { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.username) {
      toast.error("Name and username are required");
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = passwords;
    const isChangingPassword = Boolean(oldPassword || newPassword || confirmPassword);

    if (isChangingPassword) {
      if (!oldPassword) {
        toast.error("Please enter your current (old) password.");
        return;
      }
      if (!newPassword) {
        toast.error("Please enter a new password.");
        return;
      }
      if (!confirmPassword) {
        toast.error("Please confirm your new password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        username: profile.username,
        avatarUrl: profile.avatar_url,
        ...(isChangingPassword ? { currentPassword: oldPassword, newPassword } : {})
      };

      const response = await api.put("/profile", payload);
      
      // Update localStorage cached admin user data
      if (typeof window !== "undefined" && response.data.admin) {
        localStorage.setItem("adminUser", JSON.stringify(response.data.admin));
        // Dispatch custom event to notify layout
        window.dispatchEvent(new Event("adminUserUpdated"));
      }

      // Reset password fields if password was changed
      if (isChangingPassword) {
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }

      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-[#1ebcc7] animate-pulse">Loading Profile Details...</p>
      </div>
    );
  }

  const defaultAvatar = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider font-bold">My Profile</h1>
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">
          Manage your administrator account credentials, profile details, and security
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] overflow-hidden relative">
          {/* Top Banner Profile Image Container */}
          <div className="border-b border-white/5 relative overflow-hidden bg-[#121212] flex items-center justify-center min-h-[200px]">
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <Loader2 className="w-8 h-8 text-[#1ebcc7] animate-spin" />
              </div>
            )}
            
            <img 
              src={profile.avatar_url || defaultAvatar}
              alt="Avatar Banner"
              className="w-full h-auto max-h-[500px] object-contain transition-all duration-700"
            />
            
            {/* Subtle bottom fade to card background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent pointer-events-none" />
            
            {/* Upload Button overlay on the banner */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#1ebcc7] hover:text-black backdrop-blur-sm border border-white/10 text-white text-xs font-bold py-2.5 px-3.5 rounded-[12px] flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:border-transparent uppercase tracking-wider"
            >
              <Camera className="w-4 h-4" />
              <span>Change Image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Form Content Wrapper */}
          <div className="p-6 sm:p-8 space-y-6 relative">
            {/* Name and Username display */}
            <div className="pb-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wider font-bold text-white">
                  {profile.name || "Administrator"}
                </h3>
                <p className="text-xs text-[#1ebcc7] font-semibold tracking-wider uppercase mt-1">
                  {profile.username ? `@${profile.username}` : "Admin Account"}
                </p>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-0.5 bg-[#1ebcc7]/10 border border-[#1ebcc7]/20 text-[#1ebcc7] text-[10px] font-bold uppercase tracking-widest rounded-full">
                Root Admin
              </span>
            </div>

            {/* General Profile Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1ebcc7] flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Account Information</span>
              </h4>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                  <input
                    type="text"
                    placeholder="Admin Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                  <input
                    type="text"
                    placeholder="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Avatar Image URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Avatar Image URL</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-[#171717] border border-[rgba(255,255,255,.08)] rounded-[24px] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2.5 bg-[#1ebcc7]/10 border border-[#1ebcc7]/20 rounded-[12px] text-[#1ebcc7]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider font-bold text-white">Change Password</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-0.5">
                Leave blank if you do not wish to change your password
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Old / Current Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Old Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password (min. 6 characters)"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Confirm New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1ebcc7] transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#1ebcc7] focus:bg-[#1c1c1c] rounded-[16px] py-3.5 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1ebcc7] transition-all hover:border-white/20 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1ebcc7] hover:bg-[#16a5b0] text-black font-bold uppercase tracking-wider text-xs py-4.5 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(30,188,199,0.3)]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

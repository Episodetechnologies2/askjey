"use client";

import { useState } from "react";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { useSettings } from "@/components/SettingsProvider";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ACCESS_KEY = "a12061ba-c832-4a69-a7e6-d0ef888c1571";

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("access_key", ACCESS_KEY);
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("city", form.city);
      payload.append("subject", form.subject);
      payload.append("message", form.message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          city: "",
          subject: "General Inquiry",
          message: "",
        });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitError("Network error. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main>
        <section className="relative flex min-h-screen items-center pt-24 pb-12 lg:pt-32">
          <div className="container mx-auto px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left Column: Info */}
              <div className="flex flex-col justify-center">
                <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[8rem]">
                  Direct <span className="text-gradient-gold">Line</span>
                </h1>
                <p className="mt-8 max-w-md font-body text-xl text-white/60">
                  Have a question or want to collaborate? Reach out and let's
                  discuss how we can work together.
                </p>

                <div className="mt-16 space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase text-white">
                        Email
                      </h3>
                      <a
                        href={`mailto:${settings?.contact_details?.email || "askjey.official@gmail.com"}`}
                        className="mt-1 block font-body text-white/60 hover:text-primary"
                      >
                        {settings?.contact_details?.email || "askjey.official@gmail.com"}
                      </a>
                    </div>
                  </div>
                  {/* 
                  {settings?.contact_details?.phone && (
                    <div className="flex items-start gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase text-white">
                          Phone
                        </h3>
                        <a
                          href={`tel:${settings.contact_details.phone}`}
                          className="mt-1 block font-body text-white/60 hover:text-primary"
                        >
                          {settings.contact_details.phone}
                        </a>
                      </div>
                    </div>
                  )} */}

                  <div className="flex items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase text-white">
                        Studio
                      </h3>
                      <p className="mt-1 font-body text-white/60 whitespace-pre-line">
                        {settings?.contact_details?.location || "Pappanaickenpalayam,\nCoimbatore, Tamil Nadu, India"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent blur-[100px] opacity-20" />
                {isSubmitted ? (
                  <div className="relative bg-white/5 border border-white/10 p-8 backdrop-blur-xl lg:p-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-3xl font-bold uppercase text-primary mb-3">
                      Message Sent
                    </h3>
                    <p className="font-body text-white/70">
                      Thanks for reaching out. We’ll respond shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="relative bg-white/5 border border-white/10 p-8 backdrop-blur-xl lg:p-12"
                  >
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                            placeholder="johndoe@gmail.com"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                            placeholder="Coimbatore"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                          Subject
                        </label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full appearance-none rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                          >
                            <option className="bg-black">
                              General Inquiry
                            </option>
                            <option className="bg-black">
                              Mentorship
                            </option>
                            <option className="bg-black">
                              Speaking Request
                            </option>
                            <option className="bg-black">Press & Media</option>
                            <option className="bg-black">Partnership</option>
                            <option className="bg-black">Job Enquiry</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                            <svg
                              className="h-4 w-4 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/60">
                          Message
                        </label>
                        <textarea
                          rows="4"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-primary focus:outline-none"
                          placeholder="Tell us about your project..."
                        ></textarea>
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
                          <AlertCircle className="h-5 w-5" />
                          <span className="text-sm">{submitError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-black transition-all hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Let's Start", line2: "The Conversation." }} />
    </div>
  );
}

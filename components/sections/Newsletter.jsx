"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription form submitted", email);
    setEmail("");
  };

  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-12 lg:p-24">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
          
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold uppercase leading-none text-white md:text-6xl">
              Subscribe to <br />
              <span className="text-primary">Jey's Field Notes</span>
            </h2>
            <p className="mt-6 font-body text-lg text-white/70">
              Dispatches on design thinking, entrepreneurial experiments, and
              stories from The Chronicles of Jey Anand.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="h-14 w-full rounded-full bg-black/50 px-6 font-body text-white placeholder-white/40 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary focus:outline-none sm:rounded-r-none"
                required
              />
              <button
                type="submit"
                className="group flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 font-display text-lg font-bold uppercase tracking-wide text-black transition-all hover:bg-white sm:rounded-l-none"
              >
                Subscribe
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

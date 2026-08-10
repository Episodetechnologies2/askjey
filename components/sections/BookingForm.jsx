"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ACCESS_KEY = "a12061ba-c832-4a69-a7e6-d0ef888c1571";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("access_key", ACCESS_KEY);
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("company", formData.company);
      payload.append("service", formData.service);
      payload.append("message", formData.message);
      payload.append("subject", "Booking Request");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          service: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const services = [
    "Speaking Engagement",
    "Mentorship Program",
    "Business Consulting",
    "Educational Workshop",
    "Media Appearance",
    "Other",
  ];

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
        <h3 className="text-3xl md:text-4xl text-primary mb-4">
          Request Submitted!
        </h3>
        <p className="text-body-large text-white max-w-md mx-auto">
          Thank you for reaching out. We've received your request and will get
          back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-xl bg-black/50 border px-4 py-3 text-white focus:outline-none transition-colors placeholder:text-white/40 ${
              errors.name
                ? "border-red-500"
                : "border-white/10 focus:border-primary"
            }`}
            placeholder="Full Name *"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-xl bg-black/50 border px-4 py-3 text-white focus:outline-none transition-colors placeholder:text-white/40 ${
              errors.email
                ? "border-red-500"
                : "border-white/10 focus:border-primary"
            }`}
            placeholder="Email Address *"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
          placeholder="Company / Organization"
        />
      </div>

      <div className="relative">
        <select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleChange}
          className={`w-full appearance-none rounded-xl bg-black/50 border px-4 py-3 text-white focus:outline-none transition-colors ${
            errors.service
              ? "border-red-500"
              : "border-white/10 focus:border-primary"
          }`}
        >
          <option value="" className="bg-black text-white/40">
            Select Service *
          </option>
          {services.map((service) => (
            <option key={service} value={service} className="bg-black">
              {service}
            </option>
          ))}
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
        {errors.service && (
          <p className="text-red-500 text-sm mt-2">{errors.service}</p>
        )}
      </div>

      <div>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`w-full rounded-xl bg-black/50 border px-4 py-3 text-white focus:outline-none transition-colors resize-none placeholder:text-white/40 ${
            errors.message
              ? "border-red-500"
              : "border-white/10 focus:border-primary"
          }`}
          placeholder="Tell us about your needs *"
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-2">{errors.message}</p>
        )}
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
        className="w-full bg-primary text-black px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </button>
    </form>
  );
};

export default BookingForm;

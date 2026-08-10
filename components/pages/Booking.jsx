import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowUpRight } from "lucide-react";
import { CALENDLY_BOOKING_URL } from '@/lib/links';
import bookingServices from '@/lib/data/bookingServices.json';

// ── Local booking images ───────────────────────────────────────────────────
const imgSeminar = '/assets/booking/seminar1.png';
const imgWorkshops = '/assets/booking/workshops1.png';
const imgCaseStudy = '/assets/booking/case study1.png';
const imgBrandAudit = '/assets/booking/brand audit1.png';
const imgCampaigns = '/assets/booking/campaign1.png';
const imgConsultancy = '/assets/booking/consultancy1.png';

// Map service id → local image (must match the "id" field in bookingServices.json)
const LOCAL_IMAGES = {
  seminar:    imgSeminar,
  workshops:  imgWorkshops,
  caseStudy:  imgCaseStudy,
  brandAudit: imgBrandAudit,
  campaigns:  imgCampaigns,
  consultancy:imgConsultancy,
};

export default function BookingPage() {
  const handleBookNow = () => {
    window.open(CALENDLY_BOOKING_URL, "_blank", "noopener,noreferrer");
  };
  const serviceButtonClass =
    "group inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-8 py-4 font-body text-sm font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_8px_24px_rgba(30,188,199,0.35)]";

  const renderServiceCategory = (categoryData) => (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold uppercase text-white mb-4">
            {categoryData.title}
          </h2>
          <p className="mx-auto max-w-3xl font-body text-lg text-white/60">
            {categoryData.description}
          </p>
        </div>

        <div className="space-y-24 max-w-7xl mx-auto">
          {categoryData.services.map((service, index) => {
            const isOdd = index % 2 !== 0;
            return (
              <div key={service.id} className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text block — left on even, right on odd */}
                <div className={isOdd ? "order-1 lg:order-2" : ""}>
                  <h3 className="font-display text-4xl lg:text-5xl font-bold uppercase text-primary mb-6">
                    {service.title}
                  </h3>
                  <p className="font-body text-lg text-white/80 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <button onClick={handleBookNow} className={serviceButtonClass}>
                    {service.buttonLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Image block — right on even, left on odd */}
                <div
                  className={`h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 ${
                    isOdd ? "order-2 lg:order-1" : ""
                  }`}
                >
                  <img
                    src={LOCAL_IMAGES[service.id] ?? service.imageUrl}
                    alt={service.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex flex-col">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />
          </div>

          <div className="container relative z-10 text-center">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 font-body text-sm uppercase tracking-widest text-primary backdrop-blur-sm">
              Book a Session
            </span>
            <h1 className="font-display text-[5rem] font-bold uppercase leading-none lg:text-[10rem]">
              Work With <span className="text-gradient-gold">Jey</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-xl text-white/60">
              Transform your vision with strategic sessions designed for impact.
              From educational workshops to corporate consulting, unlock insights
              that drive breakthrough results and architect your next move.
            </p>
          </div>
        </section>

        {/* Educational Services Section */}
        {renderServiceCategory(bookingServices.educational)}

        {/* Corporate Services Section */}
        <div className="border-t border-white/10">
          {renderServiceCategory(bookingServices.corporate)}
        </div>

        {/* Call to Action - Explanatory Session */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="relative mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 p-12 lg:p-24">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />

              <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Get Started
                </div>

                {/* Main Heading */}
                <h2 className="font-display text-3xl md:text-4xl lg:text-6xl font-bold uppercase leading-tight">
                  <span className="text-white">Book an </span>
                  <span className="text-primary">Explanatory Session</span>
                </h2>

                {/* Description */}
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed">
                  Start your journey with a personalized exploratory conversation
                  with Jey Anand. Discuss your goals, explore possibilities, and
                  discover how we can architect your next breakthrough together.
                </p>

                {/* Button */}
                <button
                  onClick={handleBookNow}
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary px-8 py-4 font-display text-base md:text-lg font-bold uppercase tracking-wider text-black shadow-[0_6px_20px_rgba(30,188,199,0.35)] transition-all hover:scale-105 hover:bg-white hover:shadow-[0_10px_28px_rgba(30,188,199,0.5)]"
                >
                  Book a Session with Jey Anand
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Let's Make", line2: "It Happen." }} />
    </div>
  );
}

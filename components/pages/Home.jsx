import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/Hero';
import AboutSection from '@/components/sections/About';
import BrandsSection from '@/components/sections/Brands';
import Careers from '@/components/sections/Careers';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <BrandsSection />
        <Careers />
        <Newsletter />
      </main>
      <Footer ctaText={{ line1: "Let's Build", line2: "Something Epic." }} />
    </div>
  );
}

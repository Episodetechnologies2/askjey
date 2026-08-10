import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { TimelineDemo } from '@/components/ui/timeline-demo';

export default function TimelineDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main className="pt-28">
        <TimelineDemo />
      </main>
      <Footer ctaText={{ line1: "Every Journey", line2: "Starts With A Step." }} />
    </div>
  );
}




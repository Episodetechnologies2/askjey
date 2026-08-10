import "@/app/globals.css";
import { Bebas_Neue, Manrope, Inter } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/SessionProvider";
import { Metadata, Viewport } from "next";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dethrone = localFont({
  src: "../public/fonts/Dethrone Regular.otf",
  variable: "--font-dethrone",
  display: "swap",
});

const maheni = localFont({
  src: "../public/fonts/Maheni-Regular.ttf",
  variable: "--font-maheni",
  display: "swap",
});

import { getSettings } from "@/lib/settings";
import { SettingsProvider } from "@/components/SettingsProvider";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const siteTitle = settings.meta_title || "Ask Jey | Strategy, Branding, Mentorship";
  const metaDescription = settings.meta_description || "Ask Jey Anand for strategy, branding, media, and mentorship. 23+ years across design, tech, media, fashion, and hospitality with 1000+ brands consulted.";
  const favicon = settings.favicon_url || "/logo.svg";
  
  return {
    title: siteTitle,
    description: metaDescription,
    keywords: [
      "Jey Anand",
      "Ask Jey",
      "branding",
      "strategy",
      "mentorship",
      "media",
      "consulting",
      "South India brands",
      "creative director",
      "design thinking",
      "entrepreneurship"
    ],
    authors: [{ name: "Ask Jey" }],
    robots: "index, follow",
    alternates: {
      canonical: "https://askjey.in/",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://askjey.in,http://localhost:3000"),
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description: metaDescription,
      url: "https://askjey.in",
      images: [
        {
          url: "https://askjey.in/preview-image.png",
          width: 1200,
          height: 630,
          alt: "Ask Jey | Strategy, Branding, Mentorship",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: metaDescription,
      images: ["https://askjey.in/preview-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ask Jey",
    "url": "https://askjey.in",
    "logo": "https://askjey.in/preview-image.png",
    "description": "Multi-disciplinary leadership and premium branding consultancy for brands, talent, and communities by Jey Anand.",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@askjey.in",
      "contactType": "customer support"
    },
    "sameAs": [
      "https://www.instagram.com/ask.jey/",
      "https://www.facebook.com/profile.php?id=61584621863116",
      "https://www.linkedin.com/in/askjey/",
      "https://www.youtube.com/@ask-jey",
      "https://x.com/AskJeyAnand"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ask Jey Portfolio & Mentorship",
    "url": "https://askjey.in",
    "description": "Book a consulting or mentorship session with Jey Anand. Professional strategy, branding, and career acceleration.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://askjey.in/journey?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Jey Anand (Ask Jey)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Jey Anand is a premier Creative Director, Design Thinker, and Entrepreneur with over 23 years of experience. He has consulted for over 1,000 brands, transforming and building meaningful ventures across design, tech, media, fashion, and hospitality."
        }
      },
      {
        "@type": "Question",
        "name": "What services does Ask Jey offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ask Jey offers high-end business consulting and creative mentorship including Entrepreneurial Leadership, Business Acceleration, Enterprise Thinking, Startup Foundations, Career Coaching, and Motivational Talks."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book a session with Jey Anand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can easily book a 30-minute strategic consulting or mentorship session with Jey Anand directly through the integrated scheduling form on the website or via his official Calendly link."
        }
      },
      {
        "@type": "Question",
        "name": "Which notable brands has Jey Anand consulted for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Jey Anand has worked with major brands and institutions such as Suguna Chicken, The Chennai Silks, Wondr Diamonds, Asian Paints, Boomerang, MRF Racing, Roots, Pricol, LMW, Decathlon, and the Indian Navy."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get in touch for custom collaborations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can get in touch by filling out the contact form on askjey.in, emailing hello@askjey.in, or connecting via his official social media profiles on LinkedIn, Instagram, and X."
        }
      }
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ask Jey Branding & Strategy",
    "url": "https://askjey.in",
    "image": "https://askjey.in/preview-image.png",
    "description": "Leading elite strategy, branding, media, and executive mentorship consulting service by Jey Anand.",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": [
      "Brand Strategy & Positioning",
      "Entrepreneurial Leadership Mentorship",
      "Business Acceleration Consulting",
      "Creative Direction & Design Thinking"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    }
  };

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${manrope.variable} ${inter.variable} ${dethrone.variable} ${maheni.variable}`}
    >
      <body className="antialiased">
        {settings.analytics_code && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.analytics_code}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.analytics_code}');
              `}
            </Script>
          </>
        )}
        
        {/* Structured Data / JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />

        <AuthProvider>
          <SettingsProvider initialSettings={settings}>
            {children}
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


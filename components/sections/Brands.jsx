import { ArrowUpRight } from "lucide-react";
import DomeGallery from "../DomeGallery";
const logoHaribhavanam = '/assets/logo/haribhavanam.png';
const logoAanandhas = '/assets/logo/aanandhas.jpeg';
const logoMaruti = '/assets/logo/maruti.png';
const logoHyundai = '/assets/logo/hyundai.png';
const logoRamraj = '/assets/logo/ramraj.jpeg';
const logoAsianPaints = '/assets/logo/asian paints.png';
const logoChennaiSilks = '/assets/logo/chennai silks.png';
const logoSuguna = '/assets/logo/suguna.png';
const logoPricol = '/assets/logo/pricol.png';
const logoLMW = '/assets/logo/lmw.png';
const logoRoots = '/assets/logo/roots.png';
const logoAnnapoorna = '/assets/logo/annapoorna.png';
const logoBoomerang = '/assets/logo/boomerang.png';
const logoWildWater = '/assets/logo/wildWaterKingdom.png';
const logoMRF = '/assets/logo/mrf.png';
const logoHindu = '/assets/logo/hindu.png';
const logoWondr = '/assets/logo/wondr.png';
const logoVD = '/assets/logo/v&d.jpeg';
const logoEverton = '/assets/logo/everton.png';

// South Indian brand logos
const brandImages = [
  { src: logoAanandhas, alt: "Aanandhas" },
  { src: logoMaruti, alt: "Maruti" },
  { src: logoHyundai, alt: "Hyundai" },
  { src: logoRamraj, alt: "Ramraj" },
  { src: logoAsianPaints, alt: "Asian Paints" },
  { src: logoChennaiSilks, alt: "The Chennai Silks" },
  { src: logoSuguna, alt: "Suguna" },
  { src: logoPricol, alt: "Pricol" },
  { src: logoLMW, alt: "LMW" },
  { src: logoRoots, alt: "Roots" },
  { src: logoAnnapoorna, alt: "Annapoorna" },
  { src: logoBoomerang, alt: "Boomerang" },
  { src: logoWildWater, alt: "Wild Water Kingdom" },
  { src: logoMRF, alt: "MRF" },
  { src: logoHindu, alt: "The Hindu" },
  { src: logoWondr, alt: "Wondr" },
  { src: logoVD, alt: "V&D" },
  { src: logoEverton, alt: "Everton" },
];

const BrandsSection = () => {
  return (
    <section className="relative bg-black py-24 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl font-bold uppercase leading-none lg:text-7xl">
              Brands <span className="text-primary">Served</span>
            </h2>
            <p className="mt-4 font-body text-lg text-white/60">
              A glimpse of the diverse brands and organizations we've had the
              privilege to work with. Each partnership represents a unique
              journey in design, strategy, and innovation.
            </p>
          </div>
          <a
            href="/contact"
            className="group flex items-center gap-2 font-body text-sm font-bold uppercase tracking-widest text-white transition-colors hover:text-primary"
          >
            Work With Us
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <div
          className="relative w-full"
          style={{ height: "600px", minHeight: "500px" }}
        >
          <DomeGallery
            images={brandImages}
            fit={0.6}
            minRadius={400}
            maxRadius={800}
            padFactor={0.15}
            overlayBlurColor="#000000"
            maxVerticalRotationDeg={8}
            dragSensitivity={25}
            enlargeTransitionMs={400}
            segments={35}
            dragDampening={2}
            openedImageWidth="500px"
            openedImageHeight="500px"
            imageBorderRadius="20px"
            openedImageBorderRadius="30px"
            grayscale={false}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="font-body text-sm text-white/50 uppercase tracking-wider">
            Click or drag to explore • Tap images to view or close the images
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;

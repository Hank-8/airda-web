import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionNav />
      <main className="snap-container">
        <div id="hero" className="snap-section">
          <HeroSection />
        </div>
        <div id="stats" className="snap-section">
          <StatsSection />
        </div>
        <div id="about" className="snap-section">
          <AboutSection />
        </div>
        <div id="services" className="snap-section">
          <ServicesSection />
        </div>
        <div id="news" className="snap-section">
          <NewsSection />
        </div>
        <div id="faq" className="snap-section-flex">
          <FAQSection />
        </div>
        <div id="contact" className="snap-section-flex">
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  );
}

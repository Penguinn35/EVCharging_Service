import { Header } from "@/components/homePage/Header";
import { HeroSection } from "@/components/homePage/HeroSection";
import { FeaturesSection } from "@/components/homePage/FeaturesSection";
import { BusinessSection } from "@/components/homePage/BusinessSection";
import { Footer } from "@/components/homePage/Footer";
import DeveloperSection from "@/components/homePage/DeveloperSection";
export default function Home() {
  return (
    <main className="min-h-screen ">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BusinessSection />
      <DeveloperSection/>
      <Footer />
    </main>
  );
}

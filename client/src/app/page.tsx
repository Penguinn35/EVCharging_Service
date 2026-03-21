import { Header } from "@/components/homePage/Header";
import { HeroSection } from "@/components/homePage/HeroSection";
import { FeaturesSection } from "@/components/homePage/FeaturesSection";
import { BusinessSection } from "@/components/homePage/BusinessSection";
import { Footer } from "@/components/homePage/Footer";
import ProjectRoles from "@/components/homePage/ProjectRoles";
import FERole from "@/components/homePage/FERole";
import BERole from "@/components/homePage/BERole";
export default function Home() {
  return (
    <main className="min-h-screen ">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BusinessSection />
    

      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10
      [background-size:40px_40px]
      md:[background-size:60px_60px]
      lg:[background-size:80px_80px]"
          style={{
            backgroundImage: `
        linear-gradient(to right, oklch(95.1% 0.15 154.449) 1px, transparent 1px),
        linear-gradient(to bottom, oklch(95.1% 0.15 154.449) 1px, transparent 1px)
      `,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 30%)",
            maskImage: "linear-gradient(to bottom, transparent, black 30%)",
          }}
        />

        <div className="text-center md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-600">
            Nhà phát triển
          </h1>
          <p className="text-lg text-gray-600">và công nghệ trong hệ thống</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <FERole />
          <FERole />
        </div>
      </div>
      <Footer />
    </main>
  );
}

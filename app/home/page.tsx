import type { Metadata } from "next";
import CoffeeBeansHero from "@/app/components/CoffeeBeansHero";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import StepsSection from "@/app/components/home/StepsSection";
import ShopsSection from "@/app/components/home/ShopsSection";
import RankingSection from "@/app/components/home/RankingSection";
import AcademiaSection from "@/app/components/home/AcademiaSection";
import BlogSection from "@/app/components/home/BlogSection";

export const metadata: Metadata = {
  title: "Coffee Geeks Panamá | El Camino a la Gran Taza",
  description:
    "Primer concurso que premia la mejor taza de café de Panamá — cafeterías, baristas y experiencias únicas.",
  keywords: ["café", "panamá", "concurso", "barista", "specialty coffee"],
  openGraph: {
    title: "Coffee Geeks Panamá | El Camino a la Gran Taza",
    description: "Primer concurso que premia la mejor taza de café de Panamá.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Sticky top navigation */}
      <Navbar />

      {/* Push content below the fixed navbar */}
      <main style={{ paddingTop: 58 }}>
        {/* 1. Hero animado con granos de café */}
        <CoffeeBeansHero />

        {/* 2. Pasos — cómo participar */}
        <StepsSection />

        {/* 3. Cafeterías participantes */}
        <ShopsSection />

        {/* 4. Ranking en vivo */}
        <RankingSection />

        {/* 5. Academia CGP */}
        <AcademiaSection />

        {/* 6. Blog — historias */}
        <BlogSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

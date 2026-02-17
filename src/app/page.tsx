import Hero from "@/components/landing/sections/Hero";
import Header from "@/components/layout/Header";
import CityOperations from "@/components/landing/sections/CityOperations";
import ServicesWeOffer from "@/components/landing/sections/ServicesWeOffer";
import PopularPackages from "@/components/landing/sections/PopularPackages";
import BookYourTrip from "@/components/landing/sections/BookYourTrip";
import HowItWorks from "@/components/landing/sections/HowItWorks";
import WhyChooseUs from "@/components/landing/sections/WhyChooseUs";
import FeaturedIn from "@/components/landing/sections/FeaturedIn";
import FAQ from "@/components/landing/sections/FAQ";
import TravelSmartCTA from "@/components/landing/sections/TravelSmartCTA";
import Footer from "@/components/landing/sections/Footer";
import SystemHealthCheck from "@/components/layout/SystemHealthCheck";

export default function Home() {
  return (
    <>
      <SystemHealthCheck />
      <Header />
      <main>
        <Hero />
        <CityOperations />
        <ServicesWeOffer />
        <PopularPackages />
        <BookYourTrip />

        <HowItWorks />
        <WhyChooseUs />
        <FeaturedIn />
        <FAQ />
        <TravelSmartCTA />
      </main>
      <Footer />
    </>
  );
}

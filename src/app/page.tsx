import Hero from "@/components/landing/sections/Hero";
import WhatWeOffer from "@/components/landing/sections/WhatWeOffer";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeOffer />
      </main>
    </>
  );
}

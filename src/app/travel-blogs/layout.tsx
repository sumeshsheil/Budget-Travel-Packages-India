import Header from "@/components/layout/Header";
import BlogHeader from "@/components/blog/BlogHeader";
import Footer from "@/components/landing/sections/Footer";
import PromoBanner from "@/components/blog/PromoBanner";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-[110px] md:pt-[130px] lg:pt-[160px]">
        {/* Sticky Header Wrapper */}
        <div className="sticky top-[72px] md:top-[90px] lg:top-[124px] z-40 shadow-sm transform-gpu will-change-transform bg-white">
          <PromoBanner />
          <BlogHeader />
        </div>

        {/* Main Content Area */}
        <main className="min-h-screen">{children}</main>
      </div>
      <Footer />
    </>
  );
}

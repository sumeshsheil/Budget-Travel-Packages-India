import Header from "@/components/layout/Header";
import Footer from "@/components/landing/sections/Footer";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/layout/Header";
import BlogHeader from "@/components/blog/BlogHeader";
import Footer from "@/components/landing/sections/Footer";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-32">
        <BlogHeader />
      </div>
      <main className="min-h-screen pt-10 bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}

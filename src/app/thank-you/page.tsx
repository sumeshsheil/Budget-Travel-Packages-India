import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/sections/Footer";
import Button from "@/components/landing/ui/button";

export const metadata = {
  title: "Thank You | Budget Travel Packages",
  description: "Your inquiry has been submitted successfully.",
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center bg-white py-20 px-4">
        <div className="container-box max-w-2xl text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-6 shadow-sm animate-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Healing Text */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-inter text-black">
            Thank You!
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold font-inter text-secondary-text">
            Your inquiry has been submitted successfully.
          </h2>

          <p className="text-base md:text-lg text-secondary-text font-open-sans max-w-lg mx-auto leading-relaxed">
            We have received your travel details. Our expert travel consultants
            will review your requirements and get back to you shortly with the
            best packages.
          </p>

          <div className="pt-8">
            <Link href="/">
              <Button variant="primary" size="lg" className="font-inter">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

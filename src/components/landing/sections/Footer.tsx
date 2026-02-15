"use client";
import Image from "next/image";
import Link from "next/link";

// Logo and background
import logo from "@/../public/images/logo/footer-logo.svg";
import backgroundFooter from "@/../public/images/footer/background-footer.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full">
      {/* Main Footer Content */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundFooter}
            alt="Footer background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 pt-6 lg:pt-10">
          <div className="container-box">
            {/* Desktop Layout - lg and above */}
            <div className="hidden lg:flex justify-between gap-8 xl:gap-12">
              {/* Col 1: Logo Section */}
              <div className="shrink-0 pt-4 flex flex-col gap-4">
                {/* Logo */}
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={200}
                    height={85}
                    className="w-auto h-auto max-w-[180px] xl:max-w-[220px]"
                  />
                </Link>

                {/* Trust Badges */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-gray-50/50 w-fit p-1.5 rounded-lg border border-gray-100">
                    <Image
                      src="/images/footer/trust-badge/msme.png"
                      alt="Verified MSME"
                      width={1800}
                      height={1800}
                      className="w-[28px] xl:w-[32px] h-auto rounded-full"
                    />
                    <span className="text-black font-semibold text-xs xl:text-sm whitespace-nowrap font-open-sans">
                      UDYAM-WB-14-0235424
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pl-1">
                    {["ssl", "lock", "100"].map((badge) => (
                      <Image
                        key={badge}
                        src={`/images/footer/trust-badge/${badge}.svg`}
                        alt={badge}
                        width={28}
                        height={28}
                        className="w-[32px] xl:w-[36px] h-auto"
                      />
                    ))}
                  </div>
                </div>

                {/* Contact Pill */}
                <Link
                  href="mailto:hello@budgettravelpackage.in"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 transition-colors font-medium text-sm xl:text-base py-2 px-4 xl:px-5 rounded-full w-fit font-open-sans mt-2 shadow-button"
                >
                  <span className="text-white font-bold">Contact:</span>
                  <span className="text-white truncate max-w-[200px] xl:max-w-none">
                    hello@budgettravelpackage.in
                  </span>
                </Link>
              </div>

              {/* Col 2: Services & Payment (Center) */}
              <div className=" pt-6 flex flex-col items-start gap-4 xl:gap-5 px-6 xl:px-12">
                <div className="flex flex-col gap-3 text-secondary-text text-sm font-open-sans w-full">
                  <h3 className="font-bold text-black text-lg xl:text-xl tracking-tight leading-tight">
                    Promising Fixed Price
                  </h3>

                  <p className="font-medium text-black text-sm xl:text-base opacity-80 whitespace-nowrap">
                    Book Domestic &nbsp;|&nbsp; Book International
                  </p>

                  <div className="bg-primary/5 p-3 xl:p-4 rounded-xl border border-primary/10 my-1 w-full max-w-max">
                    <p className="font-bold text-primary text-sm xl:text-base">
                      Get Travel Services at Flat 9% of Total Cost
                    </p>
                  </div>

                  <Link
                    href="#"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold text-sm xl:text-base py-2.5 xl:py-3 px-6 xl:px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-fit"
                  >
                    Pay Now
                  </Link>

                  <p className="text-[10px] xl:text-xs text-red-500 font-medium italic mt-1 bg-red-50 px-2 py-1 rounded w-fit">
                    * Note: Only book after Agent Confirmation
                  </p>
                </div>
              </div>

              {/* Col 3: Address & Connect (Right) */}
              <div className="shrink-0 pt-6 flex flex-col gap-6 pl-4">
                <div className="flex flex-col gap-3">
                  <h3 className="text-black font-bold text-lg font-open-sans flex items-center gap-2">
                    <span className="w-1 h-6 bg-secondary rounded-full block"></span>
                    Head Office:
                  </h3>
                  <p className="text-secondary-text  text-sm font-normal font-open-sans leading-7">
                    Bengal Eco Intelligent Park, EM Block,<br /> Sector V,
                    Bidhannagar, Kolkata,<br /> West Bengal 700091
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <span className="text-black font-semibold text-base font-open-sans">
                    Follow Us On:
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      {
                        href: "https://facebook.com",
                        src: "/images/footer/social/facebook.svg",
                        alt: "Facebook",
                      },
                      {
                        href: "https://instagram.com",
                        src: "/images/footer/social/instagram.svg",
                        alt: "Instagram",
                      },
                      {
                        href: "https://youtube.com",
                        src: "/images/footer/social/youtube.svg",
                        alt: "YouTube",
                      },
                    ].map((social) => (
                      <Link
                        key={social.alt}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110 hover:opacity-80 p-1"
                      >
                        <Image
                          src={social.src}
                          alt={social.alt}
                          width={28}
                          height={28}
                          className="w-7 h-7"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - below lg */}
            <div className="lg:hidden flex flex-col gap-8">
              {/* Logo Section */}
              <div className="flex flex-col gap-4 text-center items-center">
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={180}
                    height={76}
                    className="w-auto h-auto"
                  />
                </Link>

                <div className="flex flex-wrap justify-center items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <Image
                      src="/images/footer/trust-badge/msme.png"
                      alt="Verified"
                      width={1800}
                      height={1800}
                      className="w-[24px] h-auto rounded-full"
                    />
                    <span className="text-black font-medium text-xs font-open-sans">
                      UDYAM-WB-14-0235424
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {["ssl", "lock", "100"].map((badge) => (
                    <Image
                      key={badge}
                      src={`/images/footer/trust-badge/${badge}.svg`}
                      alt="Trusted"
                      width={32}
                      height={32}
                      className="w-[32px] h-auto"
                    />
                  ))}
                </div>

                <Link
                  href="mailto:hello@budgettravelpackage.in"
                  className="inline-flex items-center gap-1.5 bg-secondary font-medium text-sm py-2 px-4 rounded-full w-fit font-open-sans shadow-sm"
                >
                  <span className="text-white font-bold">Contact:</span>
                  <span className="text-white">
                    hello@budgettravelpackage.in
                  </span>
                </Link>
              </div>

              {/* Services & Payment (Mobile) */}
              <div className="flex flex-col text-center items-center gap-3 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                <h3 className="font-bold text-black text-xl">
                  Promising Fixed Price
                </h3>
                <p className="font-medium text-black text-sm">
                  Book Domestic | Book International
                </p>

                <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                  <p className="font-bold text-primary text-sm">
                    Get Travel Services at Flat 9% of Total Cost
                  </p>
                </div>

                <Link
                  href="#"
                  className="inline-block bg-primary text-white font-bold py-2.5 px-8 rounded-lg shadow-md mt-2 w-full max-w-[240px]"
                >
                  Pay Now
                </Link>

                <p className="text-[10px] text-red-500 font-medium italic opacity-80">
                  * Note: Only book after Agent Confirmation
                </p>
              </div>

              {/* Address & Social (Mobile) */}
              <div className="flex flex-col items-center text-center gap-6">
                {/* Address */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-black font-bold text-lg font-open-sans">
                    Head Office:
                  </h3>
                  <p className="text-secondary-text text-sm font-normal font-open-sans leading-relaxed">
                    Bengal Eco Intelligent Park, EM Block, Sector V,
                    <br />
                    Bidhannagar, Kolkata, West Bengal 700091
                  </p>
                </div>

                {/* Follow Us */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-black font-semibold text-sm font-open-sans">
                    Follow Us:
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      {
                        href: "https://facebook.com",
                        src: "/images/footer/social/facebook.svg",
                        alt: "Facebook",
                      },
                      {
                        href: "https://instagram.com",
                        src: "/images/footer/social/instagram.svg",
                        alt: "Instagram",
                      },
                      {
                        href: "https://youtube.com",
                        src: "/images/footer/social/youtube.svg",
                        alt: "YouTube",
                      },
                    ].map((social) => (
                      <Link
                        key={social.alt}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                      >
                        <Image
                          src={social.src}
                          alt={social.alt}
                          width={28}
                          height={28}
                          className="w-7 h-7"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Border top with #CECECE, full width */}
          <div className="w-full border-t border-[#CECECE] mt-6">
            <div className="container-box py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left: Links */}
                <div className="flex items-center gap-2 text-secondary-text text-xs md:text-sm lg:text-base font-open-sans">
                  <Link
                    href="/travel-blogs"
                    className="hover:text-primary transition-colors"
                  >
                    Travel Blogs
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/legal-policies"
                    className="hover:text-primary transition-colors"
                  >
                    Legal Policies
                  </Link>
                </div>

                {/* Center: Copyright */}
                <p className="text-secondary-text text-xs md:text-sm lg:text-base font-open-sans">
                  ©{currentYear} Budget Travel Packages ™. All Rights Reserved.
                </p>

                {/* Right: Payment Icons */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/footer/payments/visa.svg"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="h-5 w-auto"
                  />
                  <Image
                    src="/images/footer/payments/upi.svg"
                    alt="UPI"
                    width={40}
                    height={24}
                    className="h-5 w-auto"
                  />
                  <Image
                    src="/images/footer/payments/rupay.svg"
                    alt="RuPay"
                    width={40}
                    height={24}
                    className="h-5 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

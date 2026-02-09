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
            <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] gap-x-8">
              {/* Row 1: Empty cell + Multi City Operations Title spanning 3 columns */}
              <div className="row-start-1"></div>
              <div className="row-start-1 col-span-3 pb-3 border-b border-primary">
                <h2 className="text-black text-center font-bold text-xl font-open-sans">
                  Multi City Operations:
                </h2>
              </div>

              {/* Row 2: Logo section (includes Contact button) + 3 Office columns */}
              <div className="row-start-2 pt-4 flex flex-col gap-3">
                {/* Logo */}
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={172}
                    height={73}
                    className="w-auto h-auto"
                  />
                </Link>

                {/* UDYAM Number with Verified Icon */}
                <div className="flex items-center gap-2">
                  <span className="text-black font-medium text-base whitespace-nowrap font-open-sans">
                    UDYAM-WB-14-0235424
                  </span>
                  <Image
                    src="/images/footer/trust-badge/ssl.svg"
                    alt="Verified"
                    width={18}
                    height={18}
                    className="w-[40px] h-auto"
                  />
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/footer/trust-badge/100.svg"
                    alt="100% Trusted"
                    width={28}
                    height={28}
                    className="w-[40px] h-auto"
                  />
                  <Image
                    src="/images/footer/trust-badge/guard.svg"
                    alt="Secure"
                    width={28}
                    height={28}
                    className="w-[40px] h-auto"
                  />
                  <Image
                    src="/images/footer/trust-badge/lock.svg"
                    alt="Protected"
                    width={28}
                    height={28}
                    className="w-[40px] h-auto"
                  />
                </div>

                {/* Contact Button - in logo column */}
                <Link
                  href="mailto:Hello@Budgettravelpackages"
                  className="inline-flex items-center gap-1.5 bg-secondary font-medium text-base py-1 px-3 rounded-full w-fit font-open-sans mt-2"
                >
                  <span className="text-white font-bold">Contact:</span>
                  <span className="text-white">Hello@Budgettravelpackages</span>
                </Link>
              </div>

              {/* Main Office (Kolkata) */}
              <div className="row-start-2 pt-4 flex flex-col gap-2">
                <h3 className="text-black font-semibold text-base font-open-sans">
                  Main Office
                </h3>
                <p className="text-secondary-text text-sm font-normal font-open-sans leading-relaxed">
                  <span className="font-bold">Kolkata:</span> Bengal Eco
                  Intelligent
                  <br />
                  Park, EM Block, Sector V,
                  <br />
                  Bidhannagar, Kolkata, West
                  <br />
                  Bengal 700091
                </p>
              </div>

              {/* Branch Office (Delhi) */}
              <div className="row-start-2 pt-4 flex flex-col gap-2">
                <h3 className="text-black font-semibold text-base font-open-sans underline">
                  Branch Office
                </h3>
                <p className="text-secondary-text text-sm font-normal font-open-sans leading-relaxed">
                  <span className="font-bold">Delhi:</span> Regal Building, 69,
                  <br />
                  Connaught Cir, Hanuman Road
                  <br />
                  Area, Connaught Place, New
                  <br />
                  Delhi, Delhi 110001
                </p>
              </div>

              {/* Branch Office (Mumbai) + Follow Us */}
              <div className="row-start-2 pt-4 flex flex-col gap-2">
                <h3 className="text-black font-semibold text-base font-open-sans">
                  Branch Office
                </h3>
                <p className="text-secondary-text text-sm font-normal font-open-sans leading-relaxed">
                  <span className="font-bold">Mumbai:</span> The Empire Business
                  <br />
                  Centre, A Wing, IA Project Rd,
                  <br />
                  Andheri East, Mumbai,
                  <br />
                  Maharashtra 400099
                </p>

                {/* Follow Us & Social Icons */}
                <div className="flex items-center gap-2 mt-auto pt-4">
                  <span className="text-black font-semibold text-base font-open-sans">
                    Follow Us:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110"
                    >
                      <Image
                        src="/images/footer/social/facebook.svg"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                    <Link
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110"
                    >
                      <Image
                        src="/images/footer/social/instagram.svg"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                    <Link
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110"
                    >
                      <Image
                        src="/images/footer/social/youtube.svg"
                        alt="YouTube"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - below lg */}
            <div className="lg:hidden flex flex-col gap-6">
              {/* Multi City Operations Title */}
              <div className="pb-3 border-b border-primary">
                <h2 className="text-black text-center font-bold text-lg font-open-sans">
                  Multi City Operations:
                </h2>
              </div>

              {/* Logo Section */}
              <div className="flex flex-col gap-3">
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={172}
                    height={73}
                    className="w-auto h-auto"
                  />
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-black font-medium text-sm whitespace-nowrap font-open-sans">
                    UDYAM-WB-14-0235424
                  </span>
                  <Image
                    src="/images/footer/trust-badge/ssl.svg"
                    alt="Verified"
                    width={18}
                    height={18}
                    className="w-[35px] h-auto"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src="/images/footer/trust-badge/100.svg"
                    alt="100% Trusted"
                    width={28}
                    height={28}
                    className="w-[35px] h-auto"
                  />
                  <Image
                    src="/images/footer/trust-badge/guard.svg"
                    alt="Secure"
                    width={28}
                    height={28}
                    className="w-[35px] h-auto"
                  />
                  <Image
                    src="/images/footer/trust-badge/lock.svg"
                    alt="Protected"
                    width={28}
                    height={28}
                    className="w-[35px] h-auto"
                  />
                </div>

                <Link
                  href="mailto:Hello@Budgettravelpackages"
                  className="inline-flex items-center gap-1.5 bg-secondary font-medium text-sm py-1 px-3 rounded-full w-fit font-open-sans"
                >
                  <span className="text-white font-bold">Contact:</span>
                  <span className="text-white">Hello@Budgettravelpackages</span>
                </Link>
              </div>

              {/* Office Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-black font-semibold text-sm font-open-sans">
                    Main Office
                  </h3>
                  <p className="text-secondary-text text-xs font-normal font-open-sans leading-relaxed">
                    <span className="font-bold">Kolkata:</span> Bengal Eco
                    Intelligent
                    <br />
                    Park, EM Block, Sector V,
                    <br />
                    Bidhannagar, Kolkata, West
                    <br />
                    Bengal 700091
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-black font-semibold text-sm font-open-sans underline">
                    Branch Office
                  </h3>
                  <p className="text-secondary-text text-xs font-normal font-open-sans leading-relaxed">
                    <span className="font-bold">Delhi:</span> Regal Building,
                    69,
                    <br />
                    Connaught Cir, Hanuman Road
                    <br />
                    Area, Connaught Place, New
                    <br />
                    Delhi, Delhi 110001
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-black font-semibold text-sm font-open-sans">
                    Branch Office
                  </h3>
                  <p className="text-secondary-text text-xs font-normal font-open-sans leading-relaxed">
                    <span className="font-bold">Mumbai:</span> The Empire
                    Business
                    <br />
                    Centre, A Wing, IA Project Rd,
                    <br />
                    Andheri East, Mumbai,
                    <br />
                    Maharashtra 400099
                  </p>
                </div>
              </div>

              {/* Follow Us */}
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-sm font-open-sans">
                  Follow Us:
                </span>
                <div className="flex items-center gap-1.5">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-110"
                  >
                    <Image
                      src="/images/footer/social/facebook.svg"
                      alt="Facebook"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-110"
                  >
                    <Image
                      src="/images/footer/social/instagram.svg"
                      alt="Instagram"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-110"
                  >
                    <Image
                      src="/images/footer/social/youtube.svg"
                      alt="YouTube"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
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
                    href="/travel-news"
                    className="hover:text-primary transition-colors"
                  >
                    Travel News
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

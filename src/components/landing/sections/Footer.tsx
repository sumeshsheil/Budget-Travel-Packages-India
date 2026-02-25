"use client";
import Image from "next/image";
import Link from "next/link";
import FooterRecentBlogs from "@/components/blog/FooterRecentBlogs";
import YoutubeIcon from "@/components/icons/Youtube";
import { SOCIAL_LINKS } from "@/lib/constants";

// Logo and background
import logo from "@/../public/images/logo/footer-logo.svg";
import backgroundFooter from "@/../public/images/footer/background-footer.png";
import backgroundFooterMobile from "@/../public/images/footer/mobile-background-footer.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative w-full scroll-mt-24">
      {/* Main Footer Content */}
      <div className="relative w-full overflow-hidden">
        {/* Background Images - Responsive */}
        <div className="absolute inset-0 z-0">
          {/* Desktop Background */}
          <div className="hidden lg:block absolute inset-0">
            <Image
              src={backgroundFooter}
              alt="Footer background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {/* Mobile Background */}
          <div className="block lg:hidden absolute inset-0">
            <Image
              src={backgroundFooterMobile}
              alt="Footer mobile background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 pt-6 lg:pt-10">
          <div className="container-box">
            {/* Desktop Layout - lg and above: 4 columns */}
            <div className="hidden lg:grid grid-cols-4 gap-6 xl:gap-8">
              {/* Col 1: Logo Section */}
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={200}
                    height={85}
                    className="w-auto h-auto max-w-[160px] xl:max-w-[240px]"
                  />
                </Link>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 w-fit">
                    <Image
                      src="/images/footer/trust-badge/msme.png"
                      alt="Verified MSME"
                      width={1800}
                      height={1800}
                      className="w-[54px] xl:w-[70px] h-auto rounded-full"
                    />
                    <span className="text-black font-semibold text-sm xl:text-base whitespace-nowrap font-open-sans">
                      UDYAM-WB-14-0235424
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pl-1">
                    {["ssl", "lock", "100"].map((badge) => (
                      <Image
                        key={badge}
                        src={`/images/footer/trust-badge/${badge}.svg`}
                        alt={badge}
                        width={36}
                        height={36}
                        className="w-[42px] xl:w-[54px] h-auto"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-3 text-secondary-text text-sm font-open-sans">
                  <h3 className="font-bold text-black text-base tracking-tight leading-tight">
                    Get Travel Services at Flat 9% of Total Cost*
                  </h3>

                  <div className="flex flex-col gap-2 w-full max-w-[280px]">
                    <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-xs xl:text-sm transition-all  w-full cursor-pointer text-center">
                      Book Devotional @ ₹333
                    </button>
                    <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-xs xl:text-sm transition-all  w-full cursor-pointer text-center">
                      Book Domestic @ ₹666
                    </button>
                    <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-xs xl:text-sm transition-all  w-full cursor-pointer text-center">
                      Book International @ ₹999
                    </button>
                  </div>
                  <p className="text-[10px] xl:text-xs text-red-500 font-medium italic bg-red-50 px-2 py-1 rounded w-fit">
                    * Note: Only book after Agent Confirmation *
                  </p>
                </div>
              </div>

              {/* Col 3: Recent Blogs */}
              <div className="pt-4">
                <FooterRecentBlogs />
              </div>

              {/* Col 4: Office Address & Social */}
              <div className="pt-4 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h3 className="text-black font-bold text-base xl:text-lg font-open-sans flex items-center gap-2">
                    <span className="w-1 h-6 bg-secondary rounded-full block"></span>
                    Office Address
                  </h3>
                  <p className="text-secondary-text text-xs xl:text-sm font-normal font-open-sans leading-6">
                    Bengal Eco Intelligent Park, EM Block,
                    <br /> Sector V, Bidhannagar, Kolkata,
                    <br /> West Bengal 700091
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <span className="text-black font-semibold text-sm font-open-sans">
                    Follow Us On:
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110 hover:opacity-80 p-1"
                    >
                      <Image
                        src="/images/footer/social/facebook.png"
                        alt="Facebook"
                        width={28}
                        height={28}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110 hover:opacity-80 p-1"
                    >
                      <Image
                        src="/images/footer/social/instagram-2.png"
                        alt="Instagram"
                        width={28}
                        height={28}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-110 hover:opacity-80 p-1"
                    >
                      <YoutubeIcon className="w-auto h-5" />
                    </Link>
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
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/footer/trust-badge/msme.png"
                      alt="Verified"
                      width={1800}
                      height={1800}
                      className="w-[48px] h-auto rounded-full"
                    />
                    <span className="text-black font-medium text-sm font-open-sans">
                      UDYAM-WB-14-0235424
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  {["ssl", "lock", "100"].map((badge) => (
                    <Image
                      key={badge}
                      src={`/images/footer/trust-badge/${badge}.svg`}
                      alt="Trusted"
                      width={48}
                      height={48}
                      className="w-[48px] lg:w-[48px] h-auto"
                    />
                  ))}
                </div>
              </div>

              {/* Services & Payment (Mobile) */}
              <div className="flex flex-col text-center items-center gap-3 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                <h3 className="font-bold text-black text-xl">
                  Get Travel Services at Flat 9% of Total Cost*
                </h3>

                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm w-full cursor-pointer">
                    Book Devotional @ ₹333
                  </button>
                  <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm w-full cursor-pointer">
                    Book Domestic @ ₹666
                  </button>
                  <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm w-full cursor-pointer">
                    Book International @ ₹999
                  </button>
                </div>
                <p className="text-[10px] text-red-500 font-medium italic opacity-80">
                  * Note: Only book after Agent Confirmation *
                </p>
              </div>

              {/* Address + Recent Blogs side by side on sm, stacked on xs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Recent Blogs (Mobile) */}
                <div className="flex flex-col items-center sm:items-start">
                  <FooterRecentBlogs />
                </div>

                {/* Office Address & Social */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-black font-bold text-lg font-open-sans">
                      Office Address
                    </h3>
                    <p className="text-secondary-text text-sm font-normal font-open-sans leading-relaxed">
                      Bengal Eco Intelligent Park, EM Block, Sector V,
                      <br />
                      Bidhannagar, Kolkata, West Bengal 700091
                    </p>
                  </div>

                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <span className="text-black font-semibold text-sm font-open-sans">
                      Follow Us:
                    </span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={SOCIAL_LINKS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                      >
                        <Image
                          src="/images/footer/social/facebook.png"
                          alt="Facebook"
                          width={32}
                          height={32}
                          className="w-7 h-7 object-contain"
                        />
                      </Link>
                      <Link
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                      >
                        <Image
                          src="/images/footer/social/instagram-2.png"
                          alt="Instagram"
                          width={32}
                          height={32}
                          className="w-7 h-7 object-contain"
                        />
                      </Link>
                      <Link
                        href={SOCIAL_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                      >
                        <YoutubeIcon className="w-auto h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Border top with #CECECE, full width */}
          <div className="w-full border-t border-[#CECECE] mt-6">
            <div className="container-box py-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Left: Links */}
                <div className="flex items-center gap-2 text-secondary-text text-xs md:text-sm lg:text-base font-open-sans">
                  <Link
                    href="/blogs"
                    className="hover:text-primary transition-colors"
                  >
                    Travel Blogs
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="http://portals.localhost:3000"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Travel Portal
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/legal"
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

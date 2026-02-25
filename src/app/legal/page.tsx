"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/landing/sections/Footer";
import { useState, useEffect } from "react";
import { List, X } from "lucide-react";

const POLICIES = [
  { id: "privacy", title: "Privacy Policy" },
  { id: "disclaimer", title: "Disclaimer" },
  { id: "terms", title: "Terms and Conditions (T&C)" },
  { id: "refund", title: "Refund and Cancellation Policy" },
  { id: "shipping", title: "Shipping and Delivery Policy" },
  { id: "jurisdiction", title: "Governing Law & Jurisdiction" },
  { id: "updates", title: "Updates to Policies" },
];

export default function LegalPoliciesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <Header />

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed bottom-8 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
        aria-label="Open Table of Contents"
      >
        <List size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-60 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Menu Card */}
          <div
            className="absolute bottom-4 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Table of Contents
              </h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {POLICIES.map((policy) => (
                  <li key={policy.id}>
                    <a
                      href={`#${policy.id}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      {policy.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-slate-50 pt-40 pb-20">
        <div className="container-box px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation - Fixed for Desktop */}
            <aside className="hidden lg:block lg:w-1/4">
              <div className="sticky top-28 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 px-2">
                  Table of Contents
                </h3>
                <nav>
                  <ul className="space-y-1">
                    {POLICIES.map((policy) => (
                      <li key={policy.id}>
                        <a
                          href={`#${policy.id}`}
                          className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          {policy.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <div className="lg:w-3/4 space-y-10">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Legal <span className="text-emerald-600">Policies</span>
                  </h1>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm text-slate-600 space-y-3 mb-8 max-w-3xl">
                    <p>
                      <strong className="text-slate-900">Brand:</strong> Budget
                      Travel Packages™
                    </p>
                    <p>
                      <strong className="text-slate-900">Tagline:</strong>{" "}
                      Explore More, Spend Less!
                    </p>
                    <p>
                      <strong className="text-slate-900">Contact Email:</strong>{" "}
                      <a
                        href="mailto:hello@budgettravelpackages.in"
                        className="text-emerald-600 hover:underline break-all"
                      >
                        hello@budgettravelpackages.in
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900">
                        Content & Blog URL:
                      </strong>{" "}
                      <a
                        href="https://budgettravelpackages.in/blogs"
                        className="text-emerald-600 hover:underline break-all"
                      >
                        https://budgettravelpackages.in/blogs
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900">
                        Business Locations:
                      </strong>{" "}
                      Kolkata (Main Office) | Delhi (Branch Office) | Mumbai
                      (Branch Office)
                    </p>
                    <div className="pt-2 mt-2 border-t border-slate-200">
                      <strong className="text-slate-900 block mb-2">
                        Social Media&apos;s:
                      </strong>
                      <ul className="space-y-1 pl-4 list-disc marker:text-emerald-500">
                        <li>
                          Facebook:{" "}
                          <a
                            href="https://www.facebook.com/budgettravelpackages"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline break-all"
                          >
                            https://www.facebook.com/budgettravelpackages
                          </a>
                        </li>
                        <li>
                          Instagram:{" "}
                          <a
                            href="https://www.instagram.com/budgettravelpackages.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline break-all"
                          >
                            https://www.instagram.com/budgettravelpackages.in
                          </a>
                        </li>
                        <li>
                          YouTube:{" "}
                          <a
                            href="https://www.youtube.com/@budgettravelpackages"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline break-all"
                          >
                            https://www.youtube.com/@budgettravelpackages
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 marker:text-emerald-600">
                  {/* Privacy Policy */}
                  <section
                    id="privacy"
                    className="scroll-mt-32 border-t border-slate-100 pt-10 first:border-0 first:pt-0"
                  >
                    <h2 className="text-3xl mb-6">1. Privacy Policy</h2>
                    <p>
                      At <strong>Budget Travel Packages</strong> (“we”, “our”,
                      “us”), we value your privacy and are committed to
                      protecting the personal information you share with us
                      through our website, mobile platforms, and other
                      communication channels. This Privacy Policy explains how
                      we collect, use, store, and protect your information when
                      you interact with our services.
                    </p>
                    <p>
                      By accessing or using our website or services, you agree
                      to the terms outlined in this Privacy Policy.
                    </p>

                    <h3>1(i). Information We Collect</h3>
                    <p>
                      We may collect the following types of information to
                      provide and improve our services:
                    </p>

                    <h4>a) Personal Information</h4>
                    <ul>
                      <li>Full name</li>
                      <li>Phone number</li>
                      <li>Email address</li>
                      <li>City and country of residence</li>
                      <li>
                        Any other details voluntarily provided through enquiry
                        forms, bookings, or communication
                      </li>
                    </ul>

                    <h4>b) Travel & Booking Information</h4>
                    <ul>
                      <li>Travel dates and destination preferences</li>
                      <li>
                        Passenger details (age, gender, identification details
                        if required for bookings)
                      </li>
                      <li>Special requests, preferences, or requirements</li>
                      <li>
                        Information required for visa processing, insurance, or
                        other travel services
                      </li>
                    </ul>

                    <h4>c) Payment Information</h4>
                    <p>
                      Payment details are processed securely through authorized
                      third-party payment gateways. We do{" "}
                      <strong>not store</strong> full card details, CVV, or
                      banking credentials on our servers.
                    </p>

                    <h4>d) Technical & Website Usage Data</h4>
                    <ul>
                      <li>IP address</li>
                      <li>Browser type and device information</li>
                      <li>Pages visited and time spent on the website</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                    <p>
                      This information helps us improve website performance and
                      enhance user experience.
                    </p>

                    <h3>1(ii). How We Use Your Information</h3>
                    <p>We use your information for the following purposes:</p>
                    <ul>
                      <li>
                        To create, plan, and manage customized travel packages
                      </li>
                      <li>To process bookings, reservations, and payments</li>
                      <li>
                        To provide quotations, confirmations, and travel
                        documents
                      </li>
                      <li>
                        To communicate important updates related to your trip
                      </li>
                      <li>
                        To respond to enquiries, support requests, or complaints
                      </li>
                      <li>
                        To send promotional offers, newsletters, or travel deals
                        (you may opt out anytime)
                      </li>
                      <li>
                        To improve our services, website functionality, and
                        customer experience
                      </li>
                      <li>
                        To comply with legal, regulatory, and tax requirements
                      </li>
                    </ul>

                    <h3>1(iii). Cookies & Tracking Technologies</h3>
                    <p>Our website uses cookies and similar technologies to:</p>
                    <ul>
                      <li>Remember user preferences</li>
                      <li>Analyze website traffic and performance</li>
                      <li>Provide a smoother browsing experience</li>
                    </ul>
                    <p>
                      You may choose to disable cookies through your browser
                      settings; however, some website features may not function
                      properly.
                    </p>

                    <h3>1(iv). Data Protection & Security</h3>
                    <p>
                      We implement reasonable administrative, technical, and
                      physical security measures to protect your personal
                      information against unauthorized access, misuse,
                      alteration, or disclosure.
                    </p>
                    <p>
                      While we strive to protect your data, no online platform
                      can guarantee complete security. Users are advised to
                      share information responsibly.
                    </p>
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6">
                      <p className="m-0 text-emerald-800 font-medium italic">
                        <strong>Important:</strong> Payment information is
                        handled only through secure third-party payment
                        processors and is not stored on our systems.
                      </p>
                    </div>

                    <h3>1(v). Third-Party Sharing</h3>
                    <p>
                      We may share your information only when necessary to
                      fulfill your travel services, including with:
                    </p>
                    <ul>
                      <li>Airlines and transport providers</li>
                      <li>Hotels and accommodation partners</li>
                      <li>Visa processing agencies</li>
                      <li>Travel insurance providers</li>
                      <li>Local tour operators and activity providers</li>
                      <li>Payment gateway and financial service providers</li>
                    </ul>
                    <p>
                      Such sharing is done strictly for service delivery
                      purposes. We do <strong>not sell or rent</strong> your
                      personal information to third parties for marketing.
                    </p>

                    <h3>1(vi). Legal Compliance</h3>
                    <p>We may disclose personal information if required to:</p>
                    <ul>
                      <li>Comply with applicable laws or legal processes</li>
                      <li>Respond to government or regulatory authorities</li>
                      <li>
                        Protect our rights, property, or safety, or that of our
                        customers
                      </li>
                    </ul>

                    <h3>1(vii). Data Retention</h3>
                    <p>
                      We retain your personal information only for as long as
                      necessary to:
                    </p>
                    <ul>
                      <li>Provide services and support</li>
                      <li>
                        Maintain records for legal, accounting, or operational
                        purposes
                      </li>
                      <li>Resolve disputes or enforce agreements</li>
                    </ul>

                    <h3>1(viii). Your Rights</h3>
                    <p>You may request to:</p>
                    <ul>
                      <li>Access or update your personal information</li>
                      <li>Correct inaccurate or incomplete details</li>
                      <li>Opt out of promotional communications</li>
                    </ul>
                    <p>
                      To make such requests, you may contact us using the
                      details provided on our website.
                    </p>

                    <h3>1(ix). Policy Updates</h3>
                    <p>
                      We may update this Privacy Policy from time to time to
                      reflect changes in our services, legal requirements, or
                      business practices. The updated version will be posted on
                      our website with the revised effective date.
                    </p>

                    <h3>1(x). Consent</h3>
                    <p>
                      By using our website and services, you acknowledge that
                      you have read, understood, and agreed to this Privacy
                      Policy.
                    </p>
                  </section>

                  {/* Disclaimer */}
                  <section
                    id="disclaimer"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">2. Disclaimer</h2>
                    <p>
                      <strong>Budget Travel Packages</strong> acts solely as a
                      travel consultant, planner, and booking facilitator. We
                      specialize in designing customized travel packages and
                      coordinating travel-related services through third-party
                      suppliers. We do not own, operate, control, or manage
                      airlines, hotels, transport companies, cruise lines, visa
                      authorities, insurance providers, or other service
                      providers involved in your travel arrangements.
                    </p>
                    <p>
                      By using our services, you acknowledge and agree to the
                      following terms:
                    </p>

                    <h3>2(i). Third-Party Service Providers</h3>
                    <p>
                      All travel services, including flights, accommodations,
                      ground transportation, sightseeing tours, visas, and
                      insurance, are provided by independent third-party
                      suppliers. These suppliers operate under their own terms
                      and conditions.
                    </p>
                    <ul>
                      <li>
                        All bookings are strictly subject to availability at the
                        time of confirmation.
                      </li>
                      <li>
                        Supplier rules, cancellation policies, refund policies,
                        and service conditions will apply.
                      </li>
                      <li>
                        We are not responsible for acts, errors, omissions,
                        representations, warranties, breaches, or negligence of
                        any third-party supplier.
                      </li>
                    </ul>

                    <h3>2(ii). Travel Disruptions & Force Majeure</h3>
                    <p>
                      We shall not be held liable for any loss, delay,
                      inconvenience, additional expense, or damage caused due to
                      circumstances beyond our reasonable control, including but
                      not limited to:
                    </p>
                    <ul>
                      <li>Flight delays or cancellations</li>
                      <li>Overbooking by airlines or hotels</li>
                      <li>Strikes, labor disputes, or industrial actions</li>
                      <li>
                        Natural disasters (floods, earthquakes, storms, etc.)
                      </li>
                      <li>Pandemics, epidemics, or health emergencies</li>
                      <li>
                        Government-imposed travel restrictions or lockdowns
                      </li>
                      <li>Political unrest or civil disturbances</li>
                    </ul>
                    <p>
                      In such cases, refunds or changes will be subject strictly
                      to the policies of the respective service providers.
                    </p>

                    <h3>2(iii). Visa & Immigration Responsibility</h3>
                    <p>
                      Visa approval or rejection is solely at the discretion of
                      the respective embassy, consulate, or immigration
                      authority.
                    </p>
                    <ul>
                      <li>
                        We may assist with documentation guidance, but we do not
                        guarantee visa approval.
                      </li>
                      <li>
                        Any visa rejection, delay, or additional documentation
                        request is beyond our control.
                      </li>
                      <li>
                        Visa fees, processing charges, or third-party service
                        fees are non-refundable unless otherwise specified by
                        the issuing authority.
                      </li>
                    </ul>

                    <h3>2(iv). Traveler’s Responsibility</h3>
                    <p>It is the traveler’s sole responsibility to ensure:</p>
                    <ul>
                      <li>
                        Passport validity meets destination country requirements
                      </li>
                      <li>Correct and valid travel documents are carried</li>
                      <li>
                        Compliance with immigration, customs, and local laws of
                        the destination country
                      </li>
                      <li>
                        Awareness of health advisories, vaccination
                        requirements, and entry regulations
                      </li>
                      <li>
                        We shall not be responsible for denied boarding, denied
                        entry, fines, penalties, or deportation resulting from
                        incomplete documentation or non-compliance.
                      </li>
                    </ul>

                    <h3>2(v). Website Information Accuracy</h3>
                    <p>
                      All information provided on our website, marketing
                      materials, and communication channels is published in good
                      faith and for general informational purposes.
                    </p>
                    <p>
                      While we strive to ensure that pricing, availability,
                      travel details, and destination information are accurate
                      and up to date:
                    </p>
                    <ul>
                      <li>
                        We do not guarantee that all information will be
                        error-free at all times.
                      </li>
                      <li>
                        Prices and availability are subject to change without
                        prior notice.
                      </li>
                      <li>
                        Typographical errors or technical inaccuracies may
                        occur.
                      </li>
                    </ul>
                    <p>
                      We reserve the right to correct errors or update
                      information at any time without prior notice.
                    </p>

                    <h3>2(vi). Limitation of Liability</h3>
                    <p>
                      To the maximum extent permitted by applicable law, our
                      liability is limited to the service fees paid directly to
                      us for the specific booking in question. We shall not be
                      liable for indirect, incidental, consequential, or special
                      damages arising from travel arrangements.
                    </p>
                    <p>
                      By booking with us or using our website, you acknowledge
                      that you have read, understood, and agreed to this
                      Disclaimer.
                    </p>
                  </section>

                  {/* Terms and Conditions */}
                  <section
                    id="terms"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">
                      3. Terms and Conditions (T&C)
                    </h2>
                    <p>
                      By accessing, browsing, or using our website and services,
                      you agree to comply with and be legally bound by the
                      following Terms & Conditions. If you do not agree with any
                      part of these terms, you are advised not to use our
                      services.
                    </p>
                    <p>
                      These Terms apply to all users, customers, and visitors
                      engaging with our travel planning and booking services.
                    </p>

                    <h3>3(i). Services Offered</h3>
                    <p>
                      We specialize in{" "}
                      <strong>100% customized travel packages</strong>,
                      carefully designed according to your budget, travel dates,
                      and personal preferences.
                    </p>
                    <p>Our services include, but are not limited to:</p>
                    <ul>
                      <li>Custom-made travel itineraries</li>
                      <li>Flight and train ticket bookings</li>
                      <li>Hotel and cruise reservations</li>
                      <li>
                        Airport transfers, sightseeing tours, and activities
                      </li>
                      <li>Visa assistance and travel insurance support</li>
                      <li>
                        Special arrangements (honeymoon decor, birthday
                        surprises, room upgrades, etc.), subject to availability
                        and supplier approval
                      </li>
                    </ul>
                    <p>
                      All services are provided in coordination with third-party
                      suppliers and are subject to their availability and terms.
                    </p>

                    <h3>3(ii). Pre-Booking Amount</h3>
                    <p>
                      To initiate the planning and customization process, a
                      mandatory non-refundable pre-booking amount must be paid:
                    </p>
                    <ul>
                      <li>
                        Devotional Trips: <strong>₹333</strong>
                      </li>
                      <li>
                        Domestic Trips: <strong>₹666</strong>
                      </li>
                      <li>
                        International Trips: <strong>₹999</strong>
                      </li>
                    </ul>
                    <h4>Important Conditions:</h4>
                    <ul>
                      <li>
                        The pre-booking amount confirms your intent to proceed
                        with planning.
                      </li>
                      <li>
                        Planning and supplier coordination will begin only after
                        receipt of this amount.
                      </li>
                      <li>
                        The pre-booking amount is strictly non-refundable, as it
                        covers consultation, itinerary design, research,
                        supplier coordination, and administrative efforts.
                      </li>
                      <li>
                        Payment of the pre-booking amount does not guarantee
                        final booking availability until full payment is made.
                      </li>
                    </ul>

                    <h3>3(iii). Payments & Installments</h3>
                    <p>After the customized package is finalized:</p>
                    <ul>
                      <li>
                        The remaining trip cost is payable in two installments
                        unless otherwise agreed in writing.
                      </li>
                      <li>Full payment must be completed before:</li>
                      <li>
                        Ticket issuance, Hotel confirmation, Cruise bookings,
                        Visa processing submission, or any other final service
                        confirmation.
                      </li>
                    </ul>
                    <p>
                      Failure to complete payment within the agreed timeline may
                      result in cancellation of services or price changes due to
                      supplier revisions.
                    </p>
                    <p>
                      We reserve the right to cancel or modify bookings if
                      payment obligations are not fulfilled on time.
                    </p>

                    <h3>3(iv). Pricing & Transparency</h3>
                    <p>
                      We are committed to maintaining clear and transparent
                      pricing:
                    </p>
                    <ul>
                      <li>
                        All costs are shared in detail before final
                        confirmation.
                      </li>
                      <li>
                        Inclusions and exclusions are clearly mentioned in your
                        itinerary or quotation.
                      </li>
                      <li>No hidden charges are applied by us.</li>
                    </ul>
                    <p>However, price changes may occur due to:</p>
                    <ul>
                      <li>
                        Airline fare revisions, Hotel tariff updates, Currency
                        exchange fluctuations (for international travel), or
                        Government taxes or regulatory changes.
                      </li>
                    </ul>
                    <p>
                      Any such changes will be communicated before final
                      confirmation.
                    </p>

                    <h3>3(v). User Responsibility</h3>
                    <p>By booking with us, you agree to:</p>
                    <ul>
                      <li>Provide accurate personal and traveler details</li>
                      <li>
                        Submit valid identification and required travel
                        documents
                      </li>
                      <li>Ensure passport validity and visa compliance</li>
                      <li>
                        Review itineraries, names, and dates carefully before
                        confirmation
                      </li>
                    </ul>
                    <p>
                      We shall not be responsible for any loss, denied boarding,
                      visa rejection, penalties, or additional charges arising
                      from incorrect or incomplete information provided by the
                      traveler.
                    </p>

                    <h3>3(vi). Modification & Cancellation</h3>
                    <ul>
                      <li>
                        Any request for modification is subject to supplier
                        availability and applicable charges.
                      </li>
                      <li>
                        Cancellation policies depend on airlines, hotels, and
                        other service providers.
                      </li>
                      <li>
                        Refunds, if applicable, will be processed as per
                        supplier rules and may take standard processing time.
                      </li>
                    </ul>
                    <p>
                      Service charges or consultation fees may be
                      non-refundable.
                    </p>

                    <h3>3(vii). Acceptance of Terms</h3>
                    <p>
                      By making a payment, submitting an enquiry, or using our
                      website, you acknowledge that:
                    </p>
                    <ul>
                      <li>
                        You have read and understood these Terms & Conditions.
                      </li>
                      <li>
                        You agree to comply with all policies mentioned herein.
                      </li>
                      <li>
                        You accept that travel services involve third-party
                        coordination and external risks beyond our control.
                      </li>
                    </ul>
                  </section>

                  {/* Refund and Cancellation Policy */}
                  <section
                    id="refund"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">
                      4. Refund and Cancellation Policy
                    </h2>
                    <p>
                      At <strong>Budget Travel Packages</strong>, we understand
                      that travel plans may change due to unforeseen
                      circumstances. This Refund & Cancellation Policy outlines
                      the terms under which cancellations and refunds are
                      processed.
                    </p>
                    <p>
                      By confirming a booking with us, you agree to the terms
                      mentioned below.
                    </p>

                    <h3>4(i). Pre-Booking Amount</h3>
                    <p>
                      The pre-booking amount paid to initiate planning and
                      customization is:
                    </p>
                    <ul>
                      <li>
                        <strong>
                          Strictly non-refundable under all circumstances
                        </strong>
                      </li>
                      <li>
                        Non-transferable to another trip, person, or future
                        booking
                      </li>
                      <li>
                        Applicable even in case of cancellation, visa rejection,
                        medical emergency, or change of plans
                      </li>
                    </ul>
                    <p>
                      This amount covers consultation, itinerary preparation,
                      supplier coordination, and administrative work.
                    </p>

                    <h3>4(ii). Trip Cancellation & Refund Structure</h3>
                    <p>
                      Refunds apply only to the{" "}
                      <strong>land package portion</strong> and exclude
                      non-refundable components such as certain flights, visas,
                      insurance, service fees, and special promotional offers.
                    </p>
                    <p>
                      Cancellation charges will be calculated based on the
                      number of days prior to the departure date:
                    </p>
                    <ul>
                      <li>
                        <strong>More than 30 days before departure:</strong> 75%
                        refund of the eligible refundable amount
                      </li>
                      <li>
                        <strong>15–30 days before departure:</strong> 50% refund
                        of the eligible refundable amount
                      </li>
                      <li>
                        <strong>7–14 days before departure:</strong> 30% refund
                        of the eligible refundable amount
                      </li>
                      <li>
                        <strong>7 days or less before departure:</strong> No
                        refund
                      </li>
                    </ul>
                    <p>All percentages apply after deducting:</p>
                    <ul>
                      <li>
                        Non-refundable supplier components, Airline cancellation
                        charges, Visa fees, Insurance charges, Government taxes
                        (if non-refundable), and Service and processing fees.
                      </li>
                    </ul>

                    <h3>4(iii). Flight Tickets & Non-Refundable Components</h3>
                    <ul>
                      <li>
                        Flight tickets are subject to airline cancellation
                        policies.
                      </li>
                      <li>Some fares may be fully non-refundable.</li>
                      <li>
                        Refund eligibility depends entirely on the airline’s
                        fare rules.
                      </li>
                    </ul>
                    <p>
                      Similarly, certain hotels, cruise bookings, special
                      offers, peak season bookings, and early-bird deals may be
                      non-refundable.
                    </p>

                    <h3>4(iv). Refund Processing Timeline</h3>
                    <p>
                      Refund timelines depend on third-party suppliers such as
                      airlines, hotels, and other service providers.
                    </p>
                    <ul>
                      <li>
                        Once we receive the refundable amount from the supplier,
                        it will be processed to the original payment method.
                      </li>
                      <li>
                        Refund processing may typically take{" "}
                        <strong>7–30 working days</strong>, depending on banks
                        and payment gateways.
                      </li>
                      <li>
                        We are not responsible for delays caused by financial
                        institutions or external suppliers.
                      </li>
                    </ul>

                    <h3>4(v). No-Show Policy</h3>
                    <p>If a traveler:</p>
                    <ul>
                      <li>
                        Fails to appear for departure, Misses a flight or train,
                        Does not check in at the hotel, or Voluntarily leaves
                        the trip midway
                      </li>
                    </ul>
                    <p>
                      <strong>No refund</strong> will be provided for unused
                      services.
                    </p>

                    <h3>4(vi). Force Majeure Situations</h3>
                    <p>
                      In cases of events beyond our control (natural disasters,
                      government restrictions, pandemics, political unrest,
                      etc.):
                    </p>
                    <ul>
                      <li>
                        Refunds will be strictly subject to supplier policies.
                      </li>
                      <li>
                        We will assist in obtaining maximum possible refunds or
                        rescheduling options wherever feasible.
                      </li>
                      <li>
                        Service charges and consultation fees may remain
                        non-refundable.
                      </li>
                    </ul>

                    <h3>4(vii). Amendments & Date Changes</h3>
                    <p>Requests for date changes or trip modifications:</p>
                    <ul>
                      <li>Are subject to availability</li>
                      <li>
                        May involve price differences and additional charges
                      </li>
                      <li>Must comply with supplier policies</li>
                    </ul>
                    <p>Approval of amendments is not guaranteed.</p>
                    <p>
                      By confirming your booking with Budget Travel Packages,
                      you acknowledge that you have read, understood, and agreed
                      to this Refund & Cancellation Policy.
                    </p>
                  </section>

                  {/* Shipping and Delivery Policy */}
                  <section
                    id="shipping"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">
                      5. Shipping and Delivery Policy
                    </h2>
                    <p>
                      Budget Travel Packages provide travel-related services
                      that are delivered digitally. As we operate in the travel
                      and tourism industry, there is{" "}
                      <strong>no physical shipping of goods</strong> involved in
                      our services.
                    </p>
                    <p>
                      By booking with us, you agree to the delivery terms
                      outlined below.
                    </p>

                    <h3>5(i). Nature of Services</h3>
                    <p>
                      All products and services offered by us are digital in
                      nature and include:
                    </p>
                    <ul>
                      <li>
                        Flight tickets (e-tickets), Hotel booking confirmations
                        and vouchers, Cruise confirmations, Customized travel
                        itineraries, Transfer and sightseeing vouchers, Visa
                        assistance documents (where applicable), Travel
                        insurance policies, and Invoices and payment receipts.
                      </li>
                    </ul>
                    <p>
                      No physical courier or postal delivery is involved unless
                      explicitly mentioned.
                    </p>

                    <h3>5(ii). Mode of Delivery</h3>
                    <p>
                      All travel documents and confirmations are delivered
                      electronically through:
                    </p>
                    <ul>
                      <li>Registered email address provided by the traveler</li>
                      <li>WhatsApp (on the registered mobile number)</li>
                      <li>Secure digital sharing platforms, if required</li>
                    </ul>
                    <p>
                      It is the traveler’s responsibility to provide accurate
                      contact details. We are not liable for failed delivery due
                      to incorrect email addresses or phone numbers.
                    </p>

                    <h3>5(iii). Processing & Delivery Timelines</h3>
                    <ul>
                      <li>
                        Most bookings are processed immediately or within a few
                        hours after successful payment confirmation.
                      </li>
                      <li>
                        Certain services (such as hotel confirmations, special
                        requests, or visa documentation) may require additional
                        time based on supplier approval.
                      </li>
                      <li>
                        Delivery timelines may vary depending on airline
                        systems, hotel policies, peak season demand, or
                        government processing times (for visas or insurance).
                      </li>
                    </ul>
                    <p>
                      You will receive confirmation once the booking has been
                      successfully processed.
                    </p>

                    <h3>5(iv). Payment Confirmation</h3>
                    <p>
                      Bookings are initiated or finalized only after payment
                      confirmation from our payment gateway or banking partner.
                    </p>
                    <ul>
                      <li>
                        Delays in bank authorization or payment verification may
                        impact delivery timelines.
                      </li>
                      <li>
                        In case of payment failure, services will not be
                        processed until successful confirmation is received.
                      </li>
                    </ul>

                    <h3>5(v). Customer Responsibility</h3>
                    <p>Travelers must:</p>
                    <ul>
                      <li>
                        Carefully review all travel documents upon receipt
                      </li>
                      <li>
                        Verify passenger names, dates, destinations, and other
                        details
                      </li>
                      <li>Report any discrepancies immediately</li>
                    </ul>
                    <p>
                      Failure to notify us of errors within a reasonable time
                      may result in additional correction charges as per airline
                      or supplier policies.
                    </p>

                    <h3>5(vi). No Physical Shipping</h3>
                    <p>Since we provide digital travel services only:</p>
                    <ul>
                      <li>There are no shipping charges.</li>
                      <li>No physical dispatch tracking is applicable.</li>
                      <li>
                        No courier or postal services are involved in standard
                        operations.
                      </li>
                    </ul>
                    <p>
                      By using our services, you acknowledge and accept this
                      Shipping & Delivery Policy.
                    </p>
                  </section>

                  {/* Governing Law & Jurisdiction */}
                  <section
                    id="jurisdiction"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">
                      6. Governing Law & Jurisdiction
                    </h2>
                    <p>
                      This policy, along with all other terms, conditions, and
                      agreements related to the services provided by Budget
                      Travel Packages, shall be governed and interpreted in
                      accordance with the laws of <strong>India</strong>.
                    </p>
                    <p>
                      By accessing our website, making a booking, or using our
                      services, you agree to the following legal terms:
                    </p>

                    <h3>6(i). Applicable Law</h3>
                    <p>
                      All transactions, bookings, communications, and
                      service-related matters between the customer and Budget
                      Travel Packages shall be governed by:
                    </p>
                    <ul>
                      <li>The laws of the Republic of India</li>
                      <li>
                        Applicable travel, consumer protection, and electronic
                        commerce regulations in India
                      </li>
                    </ul>
                    <p>
                      Any legal interpretation of our policies, terms, or
                      service agreements will be made under Indian law.
                    </p>

                    <h3>6(ii). Jurisdiction for Disputes</h3>
                    <p>
                      In the event of any dispute, claim, or legal proceeding
                      arising out of or relating to:
                    </p>
                    <ul>
                      <li>
                        Use of our website, Booking of travel services,
                        Payments, refunds, or cancellations, or Interpretation
                        of our policies or terms.
                      </li>
                    </ul>
                    <p>
                      Such matters shall fall under the exclusive jurisdiction
                      of the competent courts located in:
                    </p>
                    <p className="font-bold">Kolkata, West Bengal, India</p>
                    <p>
                      Both parties agree to submit to the jurisdiction of these
                      courts and waive any objections related to venue or
                      territorial jurisdiction.
                    </p>

                    <h3>6(iii). Dispute Resolution Approach</h3>
                    <p>
                      Before initiating any legal action, customers are
                      encouraged to contact our support team to seek a mutual
                      resolution. We aim to resolve concerns in a fair,
                      transparent, and timely manner through communication and
                      cooperation.
                    </p>

                    <h3>6(iv). Severability</h3>
                    <p>
                      If any provision of these policies is found to be invalid,
                      illegal, or unenforceable under applicable law, the
                      remaining provisions shall continue to remain in full
                      force and effect.
                    </p>
                    <p>
                      By using our website or services, you acknowledge that you
                      have read, understood, and agreed to this Governing Law &
                      Jurisdiction policy.
                    </p>
                  </section>

                  {/* Updates to Policies */}
                  <section
                    id="updates"
                    className="scroll-mt-32 border-t border-slate-100 pt-10"
                  >
                    <h2 className="text-3xl mb-6">7. Updates to Policies</h2>
                    <p>
                      Budget Travel Packages reserves the right to update,
                      modify, revise, or replace any of its policies, terms, and
                      conditions at any time to reflect changes in business
                      operations, legal requirements, service offerings, or
                      regulatory compliance.
                    </p>

                    <h3>7(i). Right to Modify Policies</h3>
                    <p>We may update the following at our discretion:</p>
                    <ul>
                      <li>
                        Privacy Policy, Terms & Conditions, Refund &
                        Cancellation Policy, Disclaimer, Shipping & Delivery
                        Policy, Governing Law & Jurisdiction, or any other
                        service-related terms published on our website.
                      </li>
                    </ul>
                    <p>
                      Such changes may be made without prior individual notice
                      to users.
                    </p>

                    <h3>7(ii). Notification of Updates</h3>
                    <p>
                      All policy updates will be published on our official Legal
                      page:
                    </p>
                    <p className="font-bold">
                      https://budgettravelpackages.in/legal-policies
                    </p>
                    <p>
                      The revised version will become effective immediately upon
                      posting unless otherwise stated.
                    </p>

                    <h3>7(iii). User Responsibility</h3>
                    <p>
                      Users are encouraged to review the Legal section
                      periodically to stay informed about any updates or
                      changes.
                    </p>
                    <p>
                      Continued use of our website, services, or making a
                      booking after any policy update constitutes your
                      acceptance of the revised terms.
                    </p>

                    <h3>7(iv). Previous Versions</h3>
                    <p>
                      Any previous versions of policies are automatically
                      replaced by the latest version available on the website.
                      In case of any dispute, the version of the policy
                      effective at the time of booking or service usage will
                      apply.
                    </p>
                    <p>
                      By using our website and services, you acknowledge that
                      you understand and agree to review and comply with the
                      most current version of our policies.
                    </p>
                  </section>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center justify-center text-center">
                  <p className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-medium text-sm">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Last Updated in 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

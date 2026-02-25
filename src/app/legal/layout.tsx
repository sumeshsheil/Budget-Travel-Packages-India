import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Policies | Budget Travel Packages",
  description:
    "Privacy Policy, Terms & Conditions, and other legal information for Budget Travel Packages.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

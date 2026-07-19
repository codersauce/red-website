import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { releaseVersion } from "./installers.generated";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

const canonicalOrigin = "https://getred.dev";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:4173";
  const protocol = requestHeaders.get("x-forwarded-proto") === "http" ? "http" : "https";
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    metadataBase: new URL(canonicalOrigin),
    title: "red — the modal editor for the agent era",
    description: "Fast, familiar modal editing with modern code intelligence and reviewable agent proposals. One self-contained Rust binary for macOS, Linux, and Windows.",
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    other: { "theme-color": "#101014" },
    openGraph: { title: "red — the modal editor for the agent era", description: "Every agent edit is a proposal. Nothing touches your files until you accept it.", type: "website", images: [{ url: socialImage, width: 1200, height: 630, alt: "Red editor and agent proposal preview" }] },
    twitter: { card: "summary_large_image", title: "red — the modal editor for the agent era", description: "Fast modal editing. Modern code intelligence. Reviewable agent proposals.", images: [socialImage] },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Red",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  softwareVersion: releaseVersion.replace(/^v/, ""),
  url: canonicalOrigin,
  downloadUrl: "https://github.com/codersauce/red/releases/latest",
  license: "https://github.com/codersauce/red/blob/main/LICENSE",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Modal terminal editor with tree-sitter highlighting, language servers, and reviewable agent proposals. Built in Rust.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>
    {children}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </body></html>;
}

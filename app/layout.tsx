import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:4173";
  const protocol = requestHeaders.get("x-forwarded-proto") === "http" ? "http" : "https";
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "red — the modal editor for the agent era",
    description: "Fast, familiar modal editing with modern code intelligence and reviewable agent proposals. One self-contained Rust binary for macOS, Linux, and Windows.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "red — the modal editor for the agent era", description: "Every agent edit is a proposal. Nothing touches your files until you accept it.", type: "website", images: [{ url: socialImage, width: 1731, height: 908, alt: "Red editor and agent proposal preview" }] },
    twitter: { card: "summary_large_image", title: "red — the modal editor for the agent era", description: "Fast modal editing. Modern code intelligence. Reviewable agent proposals.", images: [socialImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

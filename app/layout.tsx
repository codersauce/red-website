import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { releaseVersion } from "./installers.generated";
import { canonicalOrigin, resolvePublicOrigin } from "./public-origin";
import "./globals.css";

const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const socialImage = `${resolvePublicOrigin(requestHeaders)}/og.png?v=3`;

  return {
    metadataBase: new URL(canonicalOrigin),
    title: "red — the editor that respects your muscle memory",
    description: "A modern modal editor with language intelligence, themes, embedded plugins, and reviewable Codex proposals. One self-contained Rust binary.",
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    other: { "theme-color": "#fdfcfb" },
    openGraph: {
      title: "red — the editor that respects your muscle memory",
      description: "Modern modal editing, capable defaults, and agent changes you review before they touch your files.",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Red editor website and Rust editing preview" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "red — the editor that respects your muscle memory",
      description: "Modern modal editing, capable defaults, and reviewable agent proposals.",
      images: [socialImage],
    },
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
  const themeScript = `(function(){try{var s=localStorage.getItem("red-color-theme");var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();`;
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
    <body className={`${sans.variable} ${mono.variable}`}>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </body>
  </html>;
}

import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const font = Be_Vietnam_Pro({ subsets: ["vietnamese", "latin"], weight: ["400", "700", "800", "900"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} – Phim ngắn chi phí 0 đồng`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "vi_VN", siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.tagline, images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.tagline, images: ["/og.png"] },
};
export const viewport: Viewport = { themeColor: "#141110", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={font.className}>{children}</body>
    </html>
  );
}

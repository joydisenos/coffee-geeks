import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/app/actions/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata dinámica: se lee desde la DB en cada build/revalidación
export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();

  const title = cfg.seoTitle || "Coffee Geeks Panamá | Descubre, Vota y Recorre las Mejores lugares donde sirven café de Panamá";
  const description = cfg.seoDescription || "Explora los mejores Coffee Shop, Hoteles y Restaurantes de Panamá, participa en el concurso, vota por tu favorito y recorre la ruta de las mejores Coffee Shops con Coffee Geeks Panamá.";

  return {
    title,
    description,
    icons: {
      icon: "/fav.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_PA",
      siteName: "Coffee Geeks Panamá",
      ...(cfg.ogImage ? { images: [{ url: cfg.ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(cfg.ogImage ? { images: [cfg.ogImage] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

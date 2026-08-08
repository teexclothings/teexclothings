import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "TEEX | Premium Luxury Clothing",
    template: "%s | TEEX",
  },
  description:
    "Experience bespoke minimalist clothing. Timeless collections crafted for the contemporary wardrobe with elegant craftsmanship.",
  metadataBase: new URL("https://teexclothings.com"),
  openGraph: {
    title: "TEEX | Premium Luxury Clothing",
    description: "Discover timeless minimalist silhouettes and premium quality clothing.",
    url: "https://teexclothings.com",
    siteName: "TEEX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEEX | Premium Luxury Clothing",
    description: "Discover timeless minimalist silhouettes and premium quality clothing.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorantGaramond.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

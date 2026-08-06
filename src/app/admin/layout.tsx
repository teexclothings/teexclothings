import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TEEX | Admin Console",
  description: "Secure administrative management console for TEEX Clothings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased">
      {children}
    </div>
  );
}

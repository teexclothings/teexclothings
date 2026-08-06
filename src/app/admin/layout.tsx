import type { Metadata } from "next";
import AdminLayoutInner from "./AdminLayoutInner";

export const metadata: Metadata = {
  title: "TEEX | Admin Console",
  description: "Secure administrative management console for TEEX Clothings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}

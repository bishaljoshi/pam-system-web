import type { Metadata } from "next";
import Sidebar from "../components/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar/>
      <main style={{ flex: 1, padding: "1rem" }}>
        {children}
      </main>
    </div>
  );
}

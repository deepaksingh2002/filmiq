import type { Metadata } from "next";
import "@/app/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "AI Movie Insight Builder",
  description: "Cinematic IMDb insight experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageWrapper>
          <Navbar />
          {children}
          <Footer />
        </PageWrapper>
      </body>
    </html>
  );
}

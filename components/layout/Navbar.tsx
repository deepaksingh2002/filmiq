 "use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentY / maxScroll : 0;
      setVisible(progress < 0.5);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: visible ? 0 : -80 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-[#f5c518]/25 bg-[#121212]/85 backdrop-blur-xl"
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <div />
        <Link href="/" className="text-lg font-bold tracking-wide text-[#f5c518]">
          AI Movie Insight Builder
        </Link>
        <div className="flex items-center justify-end gap-3 text-sm">
          <Link
            href="http://github.com/deepaksingh2002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 transition-colors hover:text-[#f5c518]"
          >
            GitHub
          </Link>
          <Link
            href="http://linkedin.com/in/deepaksingh2002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 transition-colors hover:text-[#f5c518]"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

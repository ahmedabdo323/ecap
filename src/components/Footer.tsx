"use client";

import { Locale, isRtl } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const rtl = isRtl(locale);

  return (
    <footer
      dir={rtl ? "rtl" : "ltr"}
      className="bg-white "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-4">
        <img src="/logo-white.png" alt="eCAP" className="h-14 w-auto" />
        <p className="text-[13px] text-gray-400">
          &copy; {new Date().getFullYear()} eCAP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

"use client";

import { Locale, isRtl, t } from "@/lib/i18n";
import { Search } from "lucide-react";

interface HeroSectionProps {
  locale: Locale;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export default function HeroSection({
  locale,
  searchQuery,
  onSearchChange,
  onSearch,
}: HeroSectionProps) {
  const rtl = isRtl(locale);

  return (
    <section
      className="relative bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden"
      dir={rtl ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 hero-mesh pointer-events-none" />

      <div className="absolute top-6 start-[10%] w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-[10%] w-80 h-80 bg-blue-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-lg shadow-teal-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          {t(locale, "hero.badge")}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 mb-4 leading-[1.1] tracking-tight">
          {t(locale, "hero.title")}
        </h1>

        <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed text-[15px]">
          {t(locale, "hero.subtitle")}
        </p>

        <div className="flex items-center max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.03] focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-300 transition-all">
          <div className="flex items-center flex-1 px-5 py-3.5">
            <Search size={18} className="text-slate-400 me-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder={t(locale, "search.placeholder")}
              className="w-full outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-7 py-3.5 text-sm font-semibold transition-all shrink-0 cursor-pointer"
          >
            {t(locale, "search.button")}
          </button>
        </div>
      </div>
    </section>
  );
}

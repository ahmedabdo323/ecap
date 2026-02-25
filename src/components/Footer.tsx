"use client";

import { Locale, isRtl, t } from "@/lib/i18n";
import Link from "next/link";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const rtl = isRtl(locale);

  return (
    <footer
      dir={rtl ? "rtl" : "ltr"}
      className="bg-[#0f172a] text-slate-400 relative overflow-hidden"
    >
      <div className="absolute inset-0 hero-mesh-dark pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-white.png" alt="eCAP" className="h-10 w-auto" />
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-xs">
              {t(locale, "hero.subtitle").slice(0, 100)}...
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t(locale, "nav.directory")}
            </h4>
            <ul className="space-y-2.5">
              {["nav.directory", "nav.resources", "nav.joinProgram"].map((key) => (
                <li key={key}>
                  <Link href="/" className="text-[13px] text-slate-500 hover:text-teal-400 transition-colors">
                    {t(locale, key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t(locale, "filter.industries")}
            </h4>
            <ul className="space-y-2.5">
              {["Fashion", "Electronics", "FMCG", "Home & Living"].map((name) => (
                <li key={name}>
                  <span className="text-[13px] text-slate-500 hover:text-teal-400 transition-colors cursor-pointer">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t(locale, "filter.region")}
            </h4>
            <ul className="space-y-2.5">
              {["Saudi Arabia", "UAE", "Egypt", "Jordan"].map((name) => (
                <li key={name}>
                  <span className="text-[13px] text-slate-500 hover:text-teal-400 transition-colors cursor-pointer">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">
            &copy; {new Date().getFullYear()} eCAP {t(locale, "footer.tagline")}. {t(locale, "footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">Privacy</span>
            <span className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

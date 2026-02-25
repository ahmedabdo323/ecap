"use client";

import { useState } from "react";
import { Locale, localeNames, locales, isRtl, t } from "@/lib/i18n";
import Link from "next/link";
import { Globe, ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Header({ locale, onLocaleChange }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rtl = isRtl(locale);

  return (
    <header
      className="bg-[#0f172a] border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-md"
      dir={rtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo-white.png" alt="eCAP" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-[13px] text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all"
            >
              {t(locale, "nav.directory")}
            </Link>
            <a
              href="https://forms.zohopublic.com/sabat/form/eCAPContentDevelopmentFormWave21/formperma/lDnHLGUYWoL8ZIuPefcLqKwNiuHJflmRzLyJNc9AYI0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all"
            >
              {t(locale, "nav.joinProgram")}
            </a>

            <div className="h-5 w-px bg-white/10 mx-2" />

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-[13px] text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                <Globe size={14} className="opacity-60" />
                <span>{localeNames[locale]}</span>
                <ChevronDown size={12} className={`opacity-40 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute end-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 min-w-[140px] overflow-hidden py-1">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => { onLocaleChange(l); setLangOpen(false); }}
                        className={`flex items-center gap-2 w-full text-start px-4 py-2.5 text-sm transition-colors ${
                          l === locale
                            ? "text-blue-600 bg-blue-50 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {localeNames[l]}
                        {l === locale && (
                          <span className="ms-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0f172a]/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition"
              onClick={() => setMobileOpen(false)}
            >
              {t(locale, "nav.directory")}
            </Link>
            <a
              href="https://forms.zohopublic.com/sabat/form/eCAPContentDevelopmentFormWave21/formperma/lDnHLGUYWoL8ZIuPefcLqKwNiuHJflmRzLyJNc9AYI0"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition"
              onClick={() => setMobileOpen(false)}
            >
              {t(locale, "nav.joinProgram")}
            </a>
            <div className="border-t border-white/[0.06] pt-2 mt-2">
              <p className="px-3 text-[10px] uppercase text-slate-500 tracking-wider mb-1">Language</p>
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => { onLocaleChange(l); setMobileOpen(false); }}
                  className={`block w-full text-start text-sm px-3 py-2 rounded-lg transition ${
                    l === locale ? "text-teal-400 font-medium" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {localeNames[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

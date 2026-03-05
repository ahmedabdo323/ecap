"use client";

import { useState } from "react";
import { Locale, localeNames, locales, isRtl, t } from "@/lib/i18n";
import type { Country, Industry } from "@/lib/types";
import Link from "next/link";
import { Globe, ChevronDown, Menu, X, SlidersHorizontal, MapPin, Check, Filter } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

function getName(item: { nameEn: string; nameAr: string; nameFr: string }, locale: Locale) {
  if (locale === "ar") return item.nameAr || item.nameEn;
  if (locale === "fr") return item.nameFr || item.nameEn;
  return item.nameEn;
}

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  industries?: Industry[];
  countries?: Country[];
  selectedIndustryId?: string;
  selectedCountryId?: string;
  onIndustryChange?: (id: string) => void;
  onCountryChange?: (id: string) => void;
}

export default function Header({
  locale,
  onLocaleChange,
  industries = [],
  countries = [],
  selectedIndustryId = "",
  selectedCountryId = "",
  onIndustryChange,
  onCountryChange,
}: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const rtl = isRtl(locale);

  return (
    <>
      <header
        style={{ padding: "10px" }}
        className=" bg-white border-b border-white/[0.06] z-50 backdrop-blur-md sticky top-0"
        dir={rtl ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo-white.png" alt="eCAP" className="h-14 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 text-[13px] text-black hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all relative"
              >
                <Filter size={14} className="opacity-60" />
                <span>{t(locale, "filter.industries")}</span>
                {(selectedIndustryId || selectedCountryId) && (
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </button>

              <div className="h-5 w-px bg-white/10 mx-2" />

              <a
                href="https://forms.zohopublic.com/sabat/form/eCAPContentDevelopmentFormWave21/formperma/lDnHLGUYWoL8ZIuPefcLqKwNiuHJflmRzLyJNc9AYI0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-black hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                {t(locale, "nav.joinProgram")}
              </a>

              <div className="h-5 w-px bg-white/10 mx-2" />

              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-[13px] text-black hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all"
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

            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="text-black hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition relative"
              >
                <Filter size={20} />
                {(selectedIndustryId || selectedCountryId) && (
                  <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-orange-500" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-black hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop — outside header to avoid stacking context */}
      <div
        className={`md:hidden fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer — outside header to avoid stacking context */}
      <div
        dir={rtl ? "rtl" : "ltr"}
        className={`md:hidden fixed top-0 ${rtl ? "right-0" : "left-0"} z-[9999] h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileOpen
            ? "translate-x-0"
            : rtl ? "translate-x-full" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <img src="/logo-white.png" alt="eCAP" className="h-10 w-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-black hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
         
          <a
            href="https://forms.zohopublic.com/sabat/form/eCAPContentDevelopmentFormWave21/formperma/lDnHLGUYWoL8ZIuPefcLqKwNiuHJflmRzLyJNc9AYI0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-black hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.06] transition"
            onClick={() => setMobileOpen(false)}
          >
            {t(locale, "nav.joinProgram")}
          </a>
        </nav>
        <div className="px-4 mt-2">
          <div className="border-t border-slate-200 pt-4">
            <p className="px-4 text-[10px] uppercase text-slate-500 tracking-widest font-semibold mb-2">
              <Globe size={12} className="inline-block me-1.5 -mt-0.5 opacity-60" />
              Language
            </p>
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => { onLocaleChange(l); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full text-start text-sm px-4 py-2.5 rounded-xl transition ${
                  l === locale
                    ? "text-teal-400 bg-teal-400/10 font-medium"
                    : "text-black hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {localeNames[l]}
                {l === locale && (
                  <span className="ms-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter drawer backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          filtersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFiltersOpen(false)}
      />

      {/* Filter drawer */}
      <div
        dir={rtl ? "rtl" : "ltr"}
        className={`fixed top-0 ${rtl ? "left-0" : "right-0"} z-[9999] h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          filtersOpen
            ? "translate-x-0"
            : rtl ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Filter size={16} />
            {t(locale, "filter.industries")} & {t(locale, "filter.region")}
          </h3>
          <button
            onClick={() => setFiltersOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {industries.length > 0 && onIndustryChange && (
          <div className="px-5 pt-5">
            <p className="text-[10px] uppercase text-slate-500 tracking-widest font-semibold mb-3 flex items-center gap-1.5">
              <SlidersHorizontal size={12} className="opacity-60" />
              {t(locale, "filter.industries")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { onIndustryChange(""); setFiltersOpen(false); }}
                className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                  selectedIndustryId === ""
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t(locale, "filter.allIndustries")}
              </button>
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => { onIndustryChange(industry.id); setFiltersOpen(false); }}
                  className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                    selectedIndustryId === industry.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {getName(industry, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        {countries.length > 0 && onCountryChange && (
          <div className="px-5 pt-5 pb-6">
            <p className="text-[10px] uppercase text-slate-500 tracking-widest font-semibold mb-3 flex items-center gap-1.5">
              <MapPin size={12} className="opacity-60" />
              {t(locale, "filter.region")}
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => { onCountryChange(""); setFiltersOpen(false); }}
                className={`flex items-center gap-2.5 w-full text-start text-sm px-3 py-2.5 rounded-xl transition ${
                  selectedCountryId === ""
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Globe size={14} className="text-slate-400 shrink-0" />
                <span className="flex-1">{t(locale, "filter.allRegions")}</span>
                {selectedCountryId === "" && <Check size={14} className="text-blue-600 shrink-0" />}
              </button>
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => { onCountryChange(country.id); setFiltersOpen(false); }}
                  className={`flex items-center gap-2.5 w-full text-start text-sm px-3 py-2.5 rounded-xl transition ${
                    selectedCountryId === country.id
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {country.code ? (
                    <ReactCountryFlag countryCode={country.code} svg style={{ width: "1.2em", height: "1.2em" }} className="shrink-0" />
                  ) : (
                    <Globe size={14} className="text-slate-400 shrink-0" />
                  )}
                  <span className="flex-1">{getName(country, locale)}</span>
                  {selectedCountryId === country.id && <Check size={14} className="text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

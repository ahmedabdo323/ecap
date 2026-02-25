"use client";

import { Locale, isRtl, t } from "@/lib/i18n";
import type { Country, Industry } from "@/lib/types";
import { SlidersHorizontal, MapPin, ChevronDown } from "lucide-react";

interface FiltersProps {
  locale: Locale;
  industries: Industry[];
  countries: Country[];
  selectedIndustryId: string;
  selectedCountryId: string;
  onIndustryChange: (industryId: string) => void;
  onCountryChange: (countryId: string) => void;
}

function getName(item: { nameEn: string; nameAr: string; nameFr: string }, locale: Locale) {
  if (locale === "ar") return item.nameAr || item.nameEn;
  if (locale === "fr") return item.nameFr || item.nameEn;
  return item.nameEn;
}

export default function Filters({
  locale,
  industries,
  countries,
  selectedIndustryId,
  selectedCountryId,
  onIndustryChange,
  onCountryChange,
}: FiltersProps) {
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <div dir={dir} className="bg-white border-b border-slate-100 sticky top-16 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest me-1">
              <SlidersHorizontal size={13} />
              {t(locale, "filter.industries")}
            </div>

            <button
              onClick={() => onIndustryChange("")}
              className={`px-3.5 py-[7px] text-[13px] rounded-full border font-medium transition-all ${
                selectedIndustryId === ""
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {t(locale, "filter.allIndustries")}
            </button>

            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => onIndustryChange(industry.id)}
                className={`px-3.5 py-[7px] text-[13px] rounded-full border font-medium transition-all ${
                  selectedIndustryId === industry.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {getName(industry, locale)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              <MapPin size={13} />
              {t(locale, "filter.region")}
            </span>
            <div className="relative">
              <select
                value={selectedCountryId}
                onChange={(e) => onCountryChange(e.target.value)}
                className="appearance-none border border-slate-200 rounded-xl px-4 py-[7px] pe-9 text-[13px] text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 min-w-[180px] transition-all cursor-pointer font-medium"
              >
                <option value="">{t(locale, "filter.allRegions")}</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {getName(country, locale)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

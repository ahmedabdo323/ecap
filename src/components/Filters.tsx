"use client";

import { useState, useRef, useEffect } from "react";
import { Locale, isRtl, t } from "@/lib/i18n";
import type { Country, Industry } from "@/lib/types";
import { SlidersHorizontal, MapPin, ChevronDown, Check, Globe } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

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

function CountryDropdown({
  locale,
  countries,
  selectedCountryId,
  onCountryChange,
}: {
  locale: Locale;
  countries: Country[];
  selectedCountryId: string;
  onCountryChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = countries.find((c) => c.id === selectedCountryId);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-[7px] text-[13px] text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 min-w-[200px] transition-all cursor-pointer font-medium"
      >
        {selected?.code ? (
          <ReactCountryFlag countryCode={selected.code} svg style={{ width: "1.2em", height: "1.2em" }} />
        ) : (
          <Globe size={14} className="text-slate-400" />
        )}
        <span className="flex-1 text-start">
          {selected ? getName(selected, locale) : t(locale, "filter.allRegions")}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 end-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl min-w-[260px] max-h-[320px] overflow-y-auto py-1">
          <button
            onClick={() => { onCountryChange(""); setOpen(false); }}
            className={`flex items-center gap-3 w-full text-start px-4 py-2.5 text-sm transition-colors ${
              !selectedCountryId
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Globe size={16} className="text-slate-400 shrink-0" />
            <span className="flex-1">{t(locale, "filter.allRegions")}</span>
            {!selectedCountryId && <Check size={16} className="text-blue-600 shrink-0" />}
          </button>

          {countries.map((country) => {
            const isSelected = selectedCountryId === country.id;
            return (
              <button
                key={country.id}
                onClick={() => { onCountryChange(country.id); setOpen(false); }}
                className={`flex items-center gap-3 w-full text-start px-4 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {country.code ? (
                  <ReactCountryFlag countryCode={country.code} svg style={{ width: "1.3em", height: "1.3em" }} className="shrink-0" />
                ) : (
                  <Globe size={16} className="text-slate-400 shrink-0" />
                )}
                <span className="flex-1">{getName(country, locale)}</span>
                {isSelected && <Check size={16} className="text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
    <div dir={dir} className="hidden bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/95">
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
            <CountryDropdown
              locale={locale}
              countries={countries}
              selectedCountryId={selectedCountryId}
              onCountryChange={onCountryChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

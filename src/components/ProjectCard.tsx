"use client";

import { Locale, isRtl, t } from "@/lib/i18n";
import { industryColorMap } from "@/lib/constants";
import type { Project } from "@/lib/types";
import { Globe, Mail, Phone, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  index: number;
}

function getName(item: { nameEn: string; nameAr: string; nameFr: string }, locale: Locale) {
  if (locale === "ar") return item.nameAr || item.nameEn;
  if (locale === "fr") return item.nameFr || item.nameEn;
  return item.nameEn;
}

function getLogo(project: Project, locale: Locale): string {
  if (locale === "ar" && project.logoAr) return project.logoAr;
  if (locale === "fr" && project.logoFr) return project.logoFr;
  if (project.logoEn) return project.logoEn;
  return project.logoAr || project.logoFr || "";
}

export default function ProjectCard({ project, locale, index }: ProjectCardProps) {
  const rtl = isRtl(locale);
  const name = getName(project, locale);
  const desc =
    locale === "ar" ? project.descAr || project.descEn :
    locale === "fr" ? project.descFr || project.descEn :
    project.descEn;
  const Arrow = rtl ? ArrowLeft : ArrowRight;
  const industryName = getName(project.industry, locale);
  const countryName = getName(project.country, locale);
  const colorClass = industryColorMap[project.industry.color] || industryColorMap.gray;
  const logo = getLogo(project, locale);

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-200 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-teal-400/0 to-transparent rounded-t-2xl transition-all duration-300 group-hover:via-teal-400/60" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-sm">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <span className="text-xl font-bold bg-gradient-to-br from-slate-400 to-slate-500 bg-clip-text text-transparent">
              {name.charAt(0)}
            </span>
          )}
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${colorClass}`}>
          {industryName}
        </span>
      </div>

      <h3 className="text-[15px] font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
        {name}
      </h3>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
        <Globe size={11} />
        <span>{project.website}</span>
      </div>

      <p className="text-[13px] text-slate-500 leading-relaxed mb-5 flex-1 line-clamp-2">
        {desc}
      </p>

      <div className="space-y-2 mb-5 bg-slate-50/70 rounded-xl p-3.5 border border-slate-100/80">
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <MapPin size={12} className="shrink-0 text-teal-500" />
          <span className="font-medium text-slate-600">{countryName}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <Mail size={12} className="shrink-0 text-blue-400" />
          <span>{project.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <Phone size={12} className="shrink-0 text-purple-400" />
          <span>{project.phone}</span>
        </div>
      </div>

      <button className="mt-auto flex items-center justify-between w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group/btn cursor-pointer">
        <span>{t(locale, "card.viewProfile")}</span>
        <Arrow size={15} className="transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
      </button>
    </div>
  );
}

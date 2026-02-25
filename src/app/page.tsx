"use client";

import { useState, useEffect, useCallback } from "react";
import { Locale } from "@/lib/i18n";
import { isRtl, t } from "@/lib/i18n";
import type { Project, Country, Industry } from "@/lib/types";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Filters from "@/components/Filters";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

interface ApiResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [projects, setProjects] = useState<Project[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/countries").then((r) => r.json()),
      fetch("/api/industries").then((r) => r.json()),
    ]).then(([c, i]) => {
      setCountries(c);
      setIndustries(i);
    });
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeSearch) params.set("search", activeSearch);
    if (selectedIndustryId) params.set("industryId", selectedIndustryId);
    if (selectedCountryId) params.set("countryId", selectedCountryId);
    params.set("page", currentPage.toString());
    params.set("limit", "6");

    try {
      const res = await fetch(`/api/projects?${params}`);
      const data: ApiResponse = await res.json();
      setProjects(data.projects);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, selectedIndustryId, selectedCountryId, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    setCurrentPage(1);
  };

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustryId(industryId);
    setCurrentPage(1);
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setCurrentPage(1);
  };

  const rtl = isRtl(locale);
  const startItem = (currentPage - 1) * 6 + 1;
  const endItem = Math.min(currentPage * 6, total);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50" dir={rtl ? "rtl" : "ltr"}>
      <Header locale={locale} onLocaleChange={setLocale} />
      <HeroSection
        locale={locale}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
      />
      <Filters
        locale={locale}
        industries={industries}
        countries={countries}
        selectedIndustryId={selectedIndustryId}
        selectedCountryId={selectedCountryId}
        onIndustryChange={handleIndustryChange}
        onCountryChange={handleCountryChange}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-base font-semibold text-slate-800">
            <span className="text-2xl font-extrabold text-slate-900">{total}</span>{" "}
            <span className="text-slate-500 font-medium">{t(locale, "results.projects")}</span>
          </h2>
          {total > 0 && (
            <p className="text-[13px] text-slate-400">
              {t(locale, "results.showing")}{" "}
              <span className="font-semibold text-slate-600">
                {startItem}-{endItem}
              </span>{" "}
              {t(locale, "results.of")} {total} {t(locale, "results.results")}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl skeleton" />
                  <div className="w-20 h-6 rounded-lg skeleton" />
                </div>
                <div className="h-5 skeleton rounded-lg w-3/4 mb-2" />
                <div className="h-3 skeleton rounded w-1/2 mb-4" />
                <div className="h-4 skeleton rounded w-full mb-1.5" />
                <div className="h-4 skeleton rounded w-4/5 mb-5" />
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2.5 mb-5">
                  <div className="h-3 skeleton rounded w-2/3" />
                  <div className="h-3 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
                <div className="h-11 skeleton rounded-xl" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No projects found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Try adjusting your search or filter criteria to discover more projects in the directory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        )}

        <Pagination
          locale={locale}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer locale={locale} />
    </div>
  );
}

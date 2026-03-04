"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Locale } from "@/lib/i18n";
import { isRtl, t } from "@/lib/i18n";
import type { Project, Country, Industry } from "@/lib/types";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Filters from "@/components/Filters";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { Search, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [projects, setProjects] = useState<Project[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/countries").then((r) => r.json()),
      fetch("/api/industries").then((r) => r.json()),
    ]).then(([c, i]) => {
      setCountries(c);
      setIndustries(i);
    });
  }, []);

  const fetchProjects = useCallback(async (pageNum: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams();
    if (activeSearch) params.set("search", activeSearch);
    if (selectedIndustryId) params.set("industryId", selectedIndustryId);
    if (selectedCountryId) params.set("countryId", selectedCountryId);
    params.set("page", pageNum.toString());
    params.set("limit", PAGE_SIZE.toString());

    try {
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();

      if (append) {
        setProjects((prev) => [...prev, ...data.projects]);
      } else {
        setProjects(data.projects);
      }

      setTotal(data.total);
      setHasMore(pageNum < data.totalPages);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeSearch, selectedIndustryId, selectedCountryId]);

  useEffect(() => {
    setPage(1);
    fetchProjects(1, false);
  }, [fetchProjects]);

  useEffect(() => {
    if (!sentinelRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => {
            const next = prev + 1;
            fetchProjects(next, true);
            return next;
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchProjects]);

  const handleSearch = () => {
    setActiveSearch(searchInput);
  };

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustryId(industryId);
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
  };

  const rtl = isRtl(locale);

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
                1-{projects.length}
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
          <>
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

            {loadingMore && (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="text-slate-400 animate-spin" />
                <span className="text-sm text-slate-400 ms-2">Loading more projects...</span>
              </div>
            )}

            <div ref={sentinelRef} className="h-1" />
          </>
        )}
      </main>

      <Footer locale={locale} />
    </div>
  );
}

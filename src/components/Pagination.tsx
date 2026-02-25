"use client";

import { Locale, isRtl } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  locale,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rtl = isRtl(locale);
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="flex items-center justify-center gap-1.5 pt-10 pb-4"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
      >
        <PrevIcon size={16} />
      </button>

      {pages.map((page, idx) =>
        typeof page === "string" ? (
          <span key={`dots-${idx}`} className="px-1.5 text-slate-300 text-sm select-none">
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
              currentPage === page
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
      >
        <NextIcon size={16} />
      </button>
    </div>
  );
}

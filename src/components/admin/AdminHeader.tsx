"use client";

import { LogOut, Globe } from "lucide-react";

interface AdminHeaderProps {
  adminName: string;
  onLogout: () => void;
}

export default function AdminHeader({ adminName, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/admin" className="flex items-center gap-3">
            <img src="/logo-white.png" alt="eCAP" className="h-9 w-auto" />
            <span className="text-sm font-semibold">Admin Panel</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Welcome, {adminName}</span>
            <a
              href="/"
              className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Globe size={14} />
              View Site
            </a>
            <button
              onClick={onLogout}
              className="text-sm text-slate-400 hover:text-red-400 transition flex items-center gap-1"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

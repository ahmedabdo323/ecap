"use client";

import { usePathname } from "next/navigation";
import { FolderOpen, Globe, LayoutDashboard, Users, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { label: "Projects", href: "/admin", icon: FolderOpen },
  { label: "Countries", href: "/admin/countries", icon: Globe },
  { label: "Industries", href: "/admin/industries", icon: LayoutDashboard },
  { label: "Admins", href: "/admin/admins", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, adminName, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/admin");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return null;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-slate-700/50">
          <a href="/admin" className="flex items-center gap-3">
            <img src="/logo-white.png" alt="eCAP" className="h-9 w-auto" />
            <div>
              <span className="text-sm font-semibold block">Admin Panel</span>
              <span className="text-[11px] text-slate-400">{adminName}</span>
            </div>
          </a>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <ExternalLink size={18} />
            View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}

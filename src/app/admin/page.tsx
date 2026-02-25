"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Project, Country, Industry } from "@/lib/types";
import {
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  Globe,
  FolderOpen,
  ImageIcon,
  Users,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("ecap_token", data.token);
      window.location.reload();
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src="/logo.png" alt="eCAP" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Sign in to manage projects</p>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4"
        >
          {loginError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{loginError}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [adminsCount, setAdminsCount] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/countries").then((r) => r.json()),
      fetch("/api/industries").then((r) => r.json()),
    ]).then(([c, i]) => {
      setCountries(c);
      setIndustries(i);
    });
  }, []);

  useEffect(() => {
    if (token) {
      fetch("/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setAdminsCount(Array.isArray(data) ? data.length : 0));
    }
  }, [token]);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`/api/projects?page=${page}&limit=10`);
    const data = await res.json();
    setProjects(data.projects);
    setTotalProjects(data.total);
    setTotalPages(data.totalPages);
  }, [token, page]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  const projectLogo = (p: Project) => p.logoEn || p.logoAr || p.logoFr;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your project directory</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <a href="/admin" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
            <FolderOpen size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Projects</p>
            <p className="text-xl font-bold text-gray-900">{totalProjects}</p>
          </div>
        </a>
        <a href="/admin/countries" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center">
            <Globe size={22} className="text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Countries</p>
            <p className="text-xl font-bold text-gray-900">{countries.length}</p>
          </div>
        </a>
        <a href="/admin/industries" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
            <LayoutDashboard size={22} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Industries</p>
            <p className="text-xl font-bold text-gray-900">{industries.length}</p>
          </div>
        </a>
        <a href="/admin/admins" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center">
            <Users size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Admins</p>
            <p className="text-xl font-bold text-gray-900">{adminsCount}</p>
          </div>
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          <button
            onClick={() => router.push("/admin/projects/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logos</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    No projects yet. Click &quot;Add Project&quot; to get started.
                  </td>
                </tr>
              )}
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden">
                        {projectLogo(project) ? (
                          <img src={projectLogo(project)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{project.nameEn.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.nameEn}</p>
                        <p className="text-xs text-gray-500">{project.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {(["En", "Ar", "Fr"] as const).map((lang) => {
                        const key = `logo${lang}` as keyof Project;
                        const val = project[key] as string;
                        return (
                          <div
                            key={lang}
                            className={`w-7 h-7 rounded border text-[9px] font-bold flex items-center justify-center overflow-hidden ${
                              val ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 text-gray-300"
                            }`}
                            title={`Logo ${lang}: ${val ? "uploaded" : "missing"}`}
                          >
                            {val ? (
                              <img src={val} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={12} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.industry.nameEn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.country.nameEn}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === i + 1
                    ? "bg-[#0f172a] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return <LoginForm />;

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

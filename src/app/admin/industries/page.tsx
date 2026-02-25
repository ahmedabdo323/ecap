"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import type { Industry } from "@/lib/types";

const COLOR_OPTIONS = [
  "gray", "red", "orange", "amber", "yellow", "lime", "green",
  "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet",
  "purple", "fuchsia", "pink", "rose",
];

export default function IndustriesPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    router.push("/admin");
    return null;
  }

  return (
    <AdminLayout>
      <IndustriesContent token={token} />
    </AdminLayout>
  );
}

interface IndustryForm {
  slug: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  color: string;
}

const emptyForm: IndustryForm = { slug: "", nameEn: "", nameAr: "", nameFr: "", color: "gray" };

function IndustriesContent({ token }: { token: string }) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IndustryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchIndustries = useCallback(async () => {
    const res = await fetch("/api/industries");
    if (res.ok) setIndustries(await res.json());
  }, []);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/industries/${editingId}` : "/api/industries";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchIndustries();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ind: Industry) => {
    setEditingId(ind.id);
    setForm({
      slug: ind.slug,
      nameEn: ind.nameEn,
      nameAr: ind.nameAr,
      nameFr: ind.nameFr,
      color: ind.color,
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this industry?")) return;
    const res = await fetch(`/api/industries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
      return;
    }
    fetchIndustries();
  };

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const colorBg = (c: string) => {
    const map: Record<string, string> = {
      gray: "bg-gray-100 text-gray-700", red: "bg-red-100 text-red-700",
      orange: "bg-orange-100 text-orange-700", amber: "bg-amber-100 text-amber-700",
      yellow: "bg-yellow-100 text-yellow-700", lime: "bg-lime-100 text-lime-700",
      green: "bg-green-100 text-green-700", emerald: "bg-emerald-100 text-emerald-700",
      teal: "bg-teal-100 text-teal-700", cyan: "bg-cyan-100 text-cyan-700",
      sky: "bg-sky-100 text-sky-700", blue: "bg-blue-100 text-blue-700",
      indigo: "bg-indigo-100 text-indigo-700", violet: "bg-violet-100 text-violet-700",
      purple: "bg-purple-100 text-purple-700", fuchsia: "bg-fuchsia-100 text-fuchsia-700",
      pink: "bg-pink-100 text-pink-700", rose: "bg-rose-100 text-rose-700",
    };
    return map[c] || map.gray;
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Industries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage industry categories for projects</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
            setError("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <Plus size={16} />
          Add Industry
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Industry" : "New Industry"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Name (English) *</label>
                <input
                  type="text" required value={form.nameEn}
                  onChange={(e) => {
                    const nameEn = e.target.value;
                    setForm((f) => ({
                      ...f,
                      nameEn,
                      slug: editingId ? f.slug : autoSlug(nameEn),
                    }));
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Slug *</label>
                <input
                  type="text" required value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="industry-slug"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Name (Arabic)</label>
                <input
                  type="text" dir="rtl" value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Name (French)</label>
                <input
                  type="text" value={form.nameFr}
                  onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${colorBg(c)} ${
                      form.color === c ? "ring-2 ring-offset-1 ring-blue-500" : ""
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); setError(""); }}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={saving}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Industry" : "Create Industry"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">English</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Arabic</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">French</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {industries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No industries yet.</td>
              </tr>
            )}
            {industries.map((ind) => (
              <tr key={ind.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {ind.slug}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ind.nameEn}</td>
                <td className="px-6 py-4 text-sm text-gray-600" dir="rtl">{ind.nameAr || "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ind.nameFr || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorBg(ind.color)}`}>
                    {ind.color}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(ind)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ind.id)}
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
    </div>
  );
}

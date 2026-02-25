"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Project, Country, Industry } from "@/lib/types";
import { ImageIcon, ArrowLeft } from "lucide-react";
import LogoUploader from "./LogoUploader";

interface FormData {
  nameEn: string;
  nameAr: string;
  nameFr: string;
  descEn: string;
  descAr: string;
  descFr: string;
  website: string;
  email: string;
  phone: string;
  countryId: string;
  industryId: string;
  logoEn: string;
  logoAr: string;
  logoFr: string;
}

const emptyForm: FormData = {
  nameEn: "", nameAr: "", nameFr: "",
  descEn: "", descAr: "", descFr: "",
  website: "", email: "", phone: "",
  countryId: "", industryId: "",
  logoEn: "", logoAr: "", logoFr: "",
};

interface ProjectFormProps {
  project?: Project | null;
  token: string;
}

export default function ProjectForm({ project, token }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;
  const [countries, setCountries] = useState<Country[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

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
    if (project) {
      setFormData({
        nameEn: project.nameEn,
        nameAr: project.nameAr,
        nameFr: project.nameFr,
        descEn: project.descEn,
        descAr: project.descAr,
        descFr: project.descFr,
        website: project.website,
        email: project.email,
        phone: project.phone,
        countryId: project.countryId,
        industryId: project.industryId,
        logoEn: project.logoEn,
        logoAr: project.logoAr,
        logoFr: project.logoFr,
      });
    }
  }, [project]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit
              ? "Update the project details below."
              : "Fill in the details to add a new project to the directory."}
          </p>
        </div>

        <form onSubmit={handleSave} className="px-8 py-6 space-y-8">
          {/* Logos */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon size={16} className="text-gray-400" />
              Project Logos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <LogoUploader
                label="Logo (English)"
                value={formData.logoEn}
                onChange={(url) => setFormData({ ...formData, logoEn: url })}
                token={token}
              />
              <LogoUploader
                label="Logo (Arabic)"
                value={formData.logoAr}
                onChange={(url) => setFormData({ ...formData, logoAr: url })}
                token={token}
              />
              <LogoUploader
                label="Logo (French)"
                value={formData.logoFr}
                onChange={(url) => setFormData({ ...formData, logoFr: url })}
                token={token}
              />
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Names */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Project Name</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">English *</label>
                <input
                  type="text" required value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Arabic</label>
                <input
                  type="text" dir="rtl" value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">French</label>
                <input
                  type="text" value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Descriptions */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">English *</label>
                <textarea
                  required rows={4} value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Arabic</label>
                <textarea
                  rows={4} dir="rtl" value={formData.descAr}
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">French</label>
                <textarea
                  rows={4} value={formData.descFr}
                  onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Contact & Classification */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Website *</label>
                <input
                  type="text" required value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Email *</label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone *</label>
                <input
                  type="text" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 ..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Country *</label>
                <select
                  required value={formData.countryId}
                  onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Industry *</label>
                <select
                  required value={formData.industryId}
                  onChange={(e) => setFormData({ ...formData, industryId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-5 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
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
      <ProjectForm token={token} />
    </AdminLayout>
  );
}

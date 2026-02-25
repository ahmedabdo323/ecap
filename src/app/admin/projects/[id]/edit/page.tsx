"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export default function EditProjectPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/admin");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((data) => {
          setProject(data);
          setLoadingProject(false);
        })
        .catch(() => {
          router.push("/admin");
        });
    }
  }, [params.id, router]);

  if (loading || loadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !project) return null;

  return (
    <AdminLayout>
      <ProjectForm project={project} token={token} />
    </AdminLayout>
  );
}

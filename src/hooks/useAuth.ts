"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ecap_token");
    if (saved) {
      setToken(saved);
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((data) => {
          setAdminName(data.name);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("ecap_token");
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setToken(null);
    setAdminName("");
    localStorage.removeItem("ecap_token");
  };

  return { token, adminName, loading, logout };
}

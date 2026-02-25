"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface LogoUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  token: string;
}

export default function LogoUploader({ label, value, onChange, token }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div
        className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-colors cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
              <img src={value} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{value}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 text-gray-400 group-hover:text-blue-500 transition-colors">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} className="mb-1" />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

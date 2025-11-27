"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/api/axios/axios.interceptor";

export default function Sidebar() {
  const [open, setOpen] = useState(true);


  const logout = async () => {
  try {
    
    const res = await api.post("/auth/logout");         
    console.log(res.data);
  } catch (err) {
    console.error("Logout error:", err);
  }

  document.cookie = "accessToken=; path=/; max-age=0;";

  localStorage.removeItem("accessToken");

  window.location.href = "/login";
};

  return (
    <div
      className={`h-screen bg-white border-r border-[#D1D5DB] shadow-sm transition-all duration-300 
        ${open ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg m-3"
      >
        {open ? "◀" : "▶"}
      </button>

      {/* Nav */}
      <nav className="mt-6 flex-1 space-y-2 px-3">
        <SidebarLink href="/dashboard" label="Dashboard" open={open} />
        <SidebarLink href="/projects" label="Projects" open={open} />
        <SidebarLink href="/chat" label="Chat" open={open} />
        <SidebarLink href="/meeting" label="Meeting" open={open} />
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-3 p-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827] text-sm"
      >
        {open ? "Logout" : "⏻"}
      </button>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  open,
}: {
  href: string;
  label: string;
  open: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg text-[#1F2937] hover:bg-[#F9FAFB] transition"
    >
      <span>•</span>
      {open && <span className="text-sm">{label}</span>}
    </Link>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/api/axios/axios.interceptor";
import { useUnreadNotifications } from "@/api/queries/unreadNotifications.query";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  const { data: unreadCount } = useUnreadNotifications();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    document.cookie = "accessToken=; path=/; max-age=0;";
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div
      className={`h-screen bg-white border-r border-[#D1D5DB] shadow-sm transition-all duration-300 
        ${open ? "w-64" : "w-20"} flex flex-col`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="p-3 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg m-3"
      >
        {open ? "◀" : "▶"}
      </button>

      <nav className="mt-6 flex-1 space-y-2 px-3">
        <SidebarLink href="/dashboard" label="Dashboard" open={open} />

        {/* Notifications link */}
        <SidebarLink
          href="/notifications"
          label="Notifications"
          open={open}
          badge={unreadCount}
        />

        {user && !user.company && (
          <SidebarLink href="/company/create" label="Create Company" open={open} />
        )}

        {user && user.company && (
          <>
            <SidebarLink href="/company" label="Company" open={open} />
            <SidebarLink href="/company/employees" label="Employees" open={open} />
            <SidebarLink href="/projects" label="Projects" open={open} />
          </>
        )}

        <SidebarLink href="/chat" label="Chat" open={open} />
        <SidebarLink href="/meeting" label="Meeting" open={open} />
      </nav>

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
  badge,
}: {
  href: string;
  label: string;
  open: boolean;
  badge?: number;
}) {
  const showBadge = badge && badge > 0;

  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg text-[#1F2937] hover:bg-[#F9FAFB] transition"
    >
      <div className="flex items-center gap-3">
        <span>•</span>
        {open && <span className="text-sm">{label}</span>}
      </div>

      {open && showBadge && (
        <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  );
}

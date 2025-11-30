"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/api/axios/axios.interceptor";

export default function CompanyPage() {
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get("/companies/me");
        if (res.data.success) setCompany(res.data.data);
      } catch (err) {
        console.error("Failed to fetch company:", err);
      }
    };

    fetchCompany();
  }, []);

  if (!company)
    return (
      <div className="p-10 text-[#1F2937]">
        Loading company information...
      </div>
    );

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold text-[#1F2937]">Company</h1>

      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4 w-full max-w-xl">
        <div>
          <h2 className="text-sm font-semibold text-[#1F2937]">Name</h2>
          <p className="text-sm">{company.name}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#1F2937]">
            Invite Token
          </h2>
          <p className="text-sm break-all bg-[#F9FAFB] p-2 rounded-lg border border-[#D1D5DB]">
            {company.inviteToken}
          </p>
        </div>

        <Link
          href="/company/employees"
          className="inline-block bg-[#1F2937] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#111827]"
        >
          Manage Employees
        </Link>
      </div>
    </div>
  );
}

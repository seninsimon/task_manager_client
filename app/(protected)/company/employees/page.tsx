"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios/axios.interceptor";

export default function EmployeesPage() {
  const [company, setCompany] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCompany = async () => {
    try {
      const res = await api.get("/companies/me");

      // FIX: Your backend wraps the company inside data.data
      if (res.data.success) setCompany(res.data.data.data);
    } catch (err) {
      console.error("Failed to load company:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data.data);
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchUser();
  }, []);

  const updateRole = async (userId: string, role: string) => {
    try {
      setLoading(true);
      await api.patch(`/companies/${company._id}/role/${userId}`, { role });
      await fetchCompany();
    } catch (e) {
      console.error("Role update failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!company || !currentUser)
    return <div className="p-10 text-[#1F2937]">Loading employees...</div>;

  const ownerId = company.owner?._id || company.owner;
  const isOwner = currentUser._id === ownerId;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold text-[#1F2937]">Employees</h1>

      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm w-full max-w-2xl space-y-4">

        {/* FIX: company.employees now definitely exists */}
        {company.employees?.map((emp: any) => (
          <div
            key={emp._id}
            className="flex justify-between items-center p-3 border border-[#D1D5DB] rounded-lg bg-[#F9FAFB]"
          >
            <div>
              <p className="font-semibold text-sm">{emp.name}</p>
              <p className="text-xs text-gray-600">{emp.email}</p>
            </div>

            {emp._id === ownerId ? (
              <span className="text-sm font-semibold text-[#1F2937]">Owner</span>
            ) : (
              <select
                className="border border-[#D1D5DB] p-2 rounded-lg text-sm"
                value={emp.role}
                disabled={!isOwner || loading}
                onChange={(e) => updateRole(emp._id, e.target.value)}
              >
                <option value="senior">Senior</option>
                <option value="developer">Developer</option>
              </select>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

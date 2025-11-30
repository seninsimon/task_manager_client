"use client";

import { useState } from "react";
import api from "@/api/axios/axios.interceptor";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export default function ProjectMembersModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  /* ----------------------------------------------------
   * Fetch company employees (new React Query v5 syntax)
   * ---------------------------------------------------- */
  const { data: companyData, isPending } = useQuery({
    queryKey: ["company", "me"],
    queryFn: async () => {
      const r = await api.get("/companies/me");

      // unwrap response shape safely
      const data =
        r.data?.data?.data ??
        r.data?.data ??
        r.data;

      return data; // should include { employees: [...] }
    },
    staleTime: 30_000,
  });

  const employees = companyData?.employees || [];

  /* ----------------------------------------------------
   * Add member mutation (v5 syntax)
   * ---------------------------------------------------- */
  const addMember = useMutation({
    mutationFn: async (userId: string) =>
      api.post(`/projects/${project._id}/members`, { userId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project._id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  /* ----------------------------------------------------
   * Remove member mutation (v5 syntax)
   * ---------------------------------------------------- */
  const removeMember = useMutation({
    mutationFn: async (userId: string) =>
      api.delete(`/projects/${project._id}/members/${userId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project._id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  /* ----------------------------------------------------
   * Loading state
   * ---------------------------------------------------- */
  if (isPending) {
    return (
      <div className="p-6 text-[#1F2937]">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg p-6 border border-[#D1D5DB] space-y-4 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#1F2937]">
            Manage Members
          </h3>
          <button onClick={onClose} className="text-sm">
            Close
          </button>
        </div>

        {/* Add Member */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2">
              Add employee
            </label>

            <div className="flex gap-2">
              <select
                className="flex-1 border border-[#D1D5DB] p-2 rounded-lg"
                value={selectedUser || ""}
                onChange={(e) =>
                  setSelectedUser(e.target.value || null)
                }
              >
                <option value="">Select employee...</option>

                {employees.map((emp: any) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} — {emp.email}{" "}
                    {emp.role === "owner" ? "(owner)" : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  selectedUser && addMember.mutate(selectedUser)
                }
                disabled={!selectedUser || addMember.isPending}
                className="px-4 py-2 bg-[#1F2937] text-white rounded-lg"
              >
                {addMember.isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <h4 className="text-sm font-semibold text-[#1F2937] mb-2">
              Current members
            </h4>

            <div className="space-y-2">
              {project.members.map((m: any) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between bg-[#F9FAFB] p-3 rounded-lg border border-[#D1D5DB]"
                >
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-gray-600">
                      {m.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">{m.role}</div>

                    <button
                      onClick={() =>
                        removeMember.mutate(m._id)
                      }
                      disabled={
                        removeMember.isPending ||
                        project.owner._id === m._id
                      }
                      className="px-3 py-1 border rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

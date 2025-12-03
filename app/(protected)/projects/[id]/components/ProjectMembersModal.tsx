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
  const [email, setEmail] = useState("");

  /* ----------------------------------------------------
   * Invite by Email (new flow)
   * ---------------------------------------------------- */
  const inviteMutation = useMutation({
    mutationFn: async (email: string) =>
      api.post(`/invites/${project._id}/invite-by-email`, { email }),

    onSuccess: () => {
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["project", project._id] });
    },
  });

  /* ----------------------------------------------------
   * Remove member mutation
   * ---------------------------------------------------- */
  const removeMember = useMutation({
    mutationFn: async (userId: string) =>
      api.delete(`/projects/${project._id}/members/${userId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project._id] });
    },
  });

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

        {/* Invite User by Email */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#1F2937]">
            Invite by email
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email..."
              className="flex-1 border border-[#D1D5DB] p-2 rounded-lg focus:shadow-sm outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={() => inviteMutation.mutate(email)}
              disabled={!email || inviteMutation.isPending}
              className="px-4 py-2 bg-[#1F2937] text-white rounded-lg"
            >
              {inviteMutation.isPending ? "Sending..." : "Invite"}
            </button>
          </div>

          {/* Error / Success messages */}
          {inviteMutation.error && (
            <p className="text-sm text-red-600">
              {(inviteMutation.error as any)?.response?.data?.message ||
                "Failed to send invite"}
            </p>
          )}

          {inviteMutation.isSuccess && (
            <p className="text-sm text-green-600">
              Invite sent successfully.
            </p>
          )}
        </div>

        {/* Current Members */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#1F2937]">
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
                  <div className="text-xs text-gray-600">{m.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">{m.role}</div>

                  <button
                    onClick={() => removeMember.mutate(m._id)}
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

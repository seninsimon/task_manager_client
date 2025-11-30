"use client";

import { useState } from "react";
import api from "@/api/axios/axios.interceptor";
import { Project } from "@/api/queries/getProjects.query";

export default function TaskForm({ project, onCreated }: { project: Project; onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [branchName, setBranchName] = useState("");
  const [progress, setProgress] = useState("not_started");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // utility to find member user id by email from project.members (project.members may be array of objects or ids)
  const getMemberIdByEmail = async (email: string) => {
    // Try to call backend /projects/user-by-email to get user id
    try {
      const res = await api.get(`/projects/user-by-email?email=${encodeURIComponent(email)}`);
      return res.data.user?._id || res.data.user?.id || null;
    } catch {
      return null;
    }
  };

  const submit = async () => {
    setError(null);
    if (!name) return setError("Task name is required");
    setLoading(true);

    try {
      const assigneeId = assigneeEmail ? await getMemberIdByEmail(assigneeEmail) : null;

      const payload = {
        title: name,
        description,
        dueDate: dueDate || null,
        assignee: assigneeId, // null allowed (unassigned)
        branchName,
        progress,
      };

      const res = await api.post(`/projects/${project._id}/tasks`, payload);
      if (res?.data) {
        setName("");
        setDescription("");
        setDueDate("");
        setAssigneeEmail("");
        setBranchName("");
        setProgress("not_started");
        onCreated?.();
      } else {
        setError("Could not create task");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-lg p-6">
      <h3 className="font-semibold text-[#1F2937] mb-4">Create Task</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-[#1F2937]">Task name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
            placeholder="Implement authentication"
          />
        </div>

        <div>
          <label className="text-sm text-[#1F2937]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
            rows={4}
            placeholder="Add details for the task..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-[#1F2937]">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-[#1F2937]">Assignee (email)</label>
            <input
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              placeholder="dev@company.com"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-[#1F2937]">Branch name</label>
            <input
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="feature/auth"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-[#1F2937]">Progress</label>
          <select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 mt-1"
          >
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="in_review">In review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setName("");
              setDescription("");
              setDueDate("");
              setAssigneeEmail("");
              setBranchName("");
              setProgress("not_started");
            }}
            className="px-4 py-2 rounded-lg border border-[#D1D5DB] hover:bg-[#F9FAFB]"
            disabled={loading}
          >
            Reset
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

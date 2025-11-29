"use client";

import { useState, useEffect } from "react";
import { useSearchUserByEmail } from "@/api/queries/searchUser.query";
import { useCreateProject } from "@/api/mutations/createProject.mutation";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreated: (project: any) => void;
}

export default function CreateProjectModal({ onClose, onCreated }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: userSearchData, isLoading: isSearching, refetch } = useSearchUserByEmail(emailInput);
  const createProjectMutation = useCreateProject();

  // Initialize modal visibility after component mounts
  useEffect(() => {
    setIsModalVisible(true);
  }, []);

  // Search user while typing with debounce
  useEffect(() => {
    if (!emailInput) {
      return;
    }

    const timeout = setTimeout(() => {
      refetch();
    }, 400);

    return () => clearTimeout(timeout);
  }, [emailInput, refetch]);

  const getEmailStatus = () => {
    if (!emailInput) return null;
    if (isSearching) return "searching";
    if (userSearchData?.data.found) return "found";
    return "not-found";
  };

  const emailStatus = getEmailStatus();

  const addEmail = () => {
    if (emailStatus !== "found") return;
    if (members.includes(emailInput)) return;

    setMembers([...members, emailInput]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setMembers(members.filter((m) => m !== email));
  };

  const submit = async () => {
    if (!projectName.trim()) {
      alert("Project name required");
      return;
    }

    try {
      const result = await createProjectMutation.mutateAsync({
        name: projectName,
        repoUrl,
        emails: members,
      }
    
    );


      
      // Call the onCreated callback with the created project data
      onCreated(result.data);
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setTimeout(onClose, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addEmail();
    }
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-[500px] rounded-lg p-6 space-y-4 border border-[#D1D5DB] animate-scaleIn">
        <h2 className="text-lg font-semibold text-[#1F2937]">Create Project</h2>

        {/* Project Name */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Project Name *</label>
          <input
            className="w-full border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm focus:border-[#1F2937] transition-colors"
            placeholder="CodeSync Platform"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* Repo URL */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Git Repository URL</label>
          <input
            className="w-full border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm focus:border-[#1F2937] transition-colors"
            placeholder="https://github.com/zenin/tasks-app"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        {/* Members */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Add Members</label>

          <div className="flex gap-2 items-center">
            <input
              className="flex-1 border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm focus:border-[#1F2937] transition-colors"
              placeholder="Enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown ={handleKeyPress}
            />

            <button
              onClick={addEmail}
              disabled={emailStatus !== "found"}
              className={`px-3 py-2 text-white rounded-lg transition-colors ${
                emailStatus === "found"
                  ? "bg-[#1F2937] hover:bg-[#111827]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </div>

          {/* Email validation text */}
          {emailInput && (
            <p
              className={`text-sm ${
                emailStatus === "found"
                  ? "text-green-600"
                  : emailStatus === "not-found"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {emailStatus === "found"
                ? "User found ✓"
                : emailStatus === "not-found"
                ? "User not found"
                : "Searching..."}
            </p>
          )}

          {/* Members list */}
          {members.length > 0 && (
            <div className="mt-2">
              <label className="text-sm text-[#1F2937]">Members ({members.length})</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {members.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-2 bg-[#F9FAFB] border border-[#D1D5DB] px-3 py-1 rounded-lg"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      onClick={() => removeEmail(email)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            disabled={createProjectMutation.isPending}
            className="px-4 py-2 rounded-lg border border-[#D1D5DB] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={createProjectMutation.isPending || !projectName.trim()}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
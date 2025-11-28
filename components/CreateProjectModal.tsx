"use client";

import { useState } from "react";

export default function CreateProjectModal({ onClose, onCreated }: any) {
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const [inviteLink, setInviteLink] = useState(
    "https://app.com/invite/project/" + Math.random().toString(36).slice(2)
  );

  const addEmail = () => {
    if (!emailInput.includes("@")) return;
    if (members.includes(emailInput)) return;

    setMembers([...members, emailInput]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setMembers(members.filter((m) => m !== email));
  };

  const regenerateLink = () => {
    const newLink =
      "https://app.com/invite/project/" + Math.random().toString(36).slice(2);
    setInviteLink(newLink);
  };

  const submit = () => {
    if (!projectName) return alert("Project name required");

    const newProject = {
      id: Date.now(),
      name: projectName,
      repo: repoUrl,
      members,
      inviteLink,
    };

    onCreated(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-lg p-6 space-y-4 border border-[#D1D5DB]">
        <h2 className="text-lg font-semibold text-[#1F2937]">Create Project</h2>

        {/* Project Name */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Project Name</label>
          <input
            className="w-full border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm"
            placeholder="CodeSync Platform"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* Repo URL */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Git Repository URL</label>
          <input
            className="w-full border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm"
            placeholder="https://github.com/zenin/tasks-app"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        {/* Members */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Add Members</label>

          <div className="flex gap-2">
            <input
              className="flex-1 border border-[#D1D5DB] rounded-lg p-2 outline-none focus:shadow-sm"
              placeholder="Enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />

            <button
              onClick={addEmail}
              className="px-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map((email) => (
              <div
                key={email}
                className="flex items-center gap-2 bg-[#F9FAFB] border border-[#D1D5DB] px-3 py-1 rounded-lg"
              >
                <span className="text-sm">{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Link */}
        <div className="space-y-1">
          <label className="text-sm text-[#1F2937]">Invite Link</label>

          <div className="flex gap-2">
            <input
              className="flex-1 border border-[#D1D5DB] rounded-lg p-2 bg-[#F9FAFB]"
              value={inviteLink}
              readOnly
            />

            <button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="px-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
            >
              Copy
            </button>

            <button
              onClick={regenerateLink}
              className="px-3 border border-[#1F2937] text-[#1F2937] rounded-lg hover:bg-[#F3F4F6]"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#D1D5DB] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

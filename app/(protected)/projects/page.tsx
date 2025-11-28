"use client";

import { useState } from "react";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]); // later replaced by API
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#1F2937]">Projects</h1>

        {projects.length > 0 && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
          >
            + Create Project
          </button>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-[#6B7280] mb-6">No projects found</p>
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
          >
            + Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#D1D5DB] rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-medium text-[#1F2937]">{p.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <CreateProjectModal
          onClose={() => setOpenModal(false)}
          onCreated={(newProject) => {
            setProjects([...projects, newProject]);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}

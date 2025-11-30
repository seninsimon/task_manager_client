"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";
import CreateProjectModal from "@/components/CreateProjectModal";
import Link from "next/link";
import { useProjects } from "@/api/queries/getProjects.query";

export default function ProjectsPage() {
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading, error } = useProjects();

  // FIXED: Handle your nested API response format
  const projects = projectsData?.data?.data || [];

  const handleProjectCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-[#1F2937]">Projects</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
          >
            + Create Project
          </button>
        </div>
        <div className="flex items-center justify-center h-40">
          <p className="text-[#6B7280]">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-[#1F2937]">Projects</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
          >
            + Create Project
          </button>
        </div>
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#1F2937]">Projects</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827] transition-colors"
        >
          + Create Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-[#6B7280] mb-6">No projects found</p>
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827] transition-colors"
          >
            + Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link
              key={project._id}
              href={`/projects/${project._id}`}
              className="bg-white border border-[#D1D5DB] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow block"
            >
              <h3 className="font-medium text-[#1F2937] mb-2">
                {project.name}
              </h3>

              {project.repoUrl && (
                <p
                  className="text-sm text-gray-500 truncate"
                  title={project.repoUrl}
                >
                  {project.repoUrl}
                </p>
              )}

              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span>
                  {project.members.length + 1} member
                  {project.members.length + 1 !== 1 ? "s" : ""}
                </span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <CreateProjectModal
          onClose={() => setOpenModal(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

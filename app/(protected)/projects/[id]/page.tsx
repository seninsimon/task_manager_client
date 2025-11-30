"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProject,
  useProjectTasks,
  useUser,
} from "@/api/hooks/project.hooks";

import TaskForm from "@/components/project/TaskForm";
import TaskList from "@/components/project/TaskList";
import ProjectMembersModal from "./components/ProjectMembersModal";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const queryClient = useQueryClient();
  const { data: userData } = useUser();
  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const { data: tasksData, isLoading: tasksLoading } = useProjectTasks(projectId);

  const [activeTab, setActiveTab] = useState<"assign" | "mytasks">("assign");

  // NEW: modal open state
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  if (projectLoading) return <div className="p-8">Loading project...</div>;
  if (!projectData) return <div className="p-8">Project not found</div>;

  const project = projectData?.data?.data;
  const tasks = tasksData?.data || [];

  const currentUser = userData?.data;
  const currentUserId = currentUser?.userId;
  const currentUserRole = currentUser?.role; // owner | senior | developer

  const ownerId = project?.owner?._id;

  // NEW: correct permission check
  const canManageMembers =
    currentUserId &&
    (currentUserId === ownerId || currentUserRole === "senior");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            {project.name}
          </h1>
          <p className="text-sm text-gray-500">{project.repoUrl}</p>
        </div>

        <div className="flex gap-3 items-center">

          {/* NEW — Manage Members Button */}
          {canManageMembers && (
            <button
              onClick={() => setMembersModalOpen(true)}
              className="px-4 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827]"
            >
              Manage Members
            </button>
          )}

          <div className="text-sm text-gray-500">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6">
        <nav className="flex gap-4">
          <button
            className={`py-2 px-4 -mb-px ${
              activeTab === "assign"
                ? "border-b-2 border-[#1F2937] text-[#1F2937]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("assign")}
          >
            Assign Tasks
          </button>

          <button
            className={`py-2 px-4 -mb-px ${
              activeTab === "mytasks"
                ? "border-b-2 border-[#1F2937] text-[#1F2937]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("mytasks")}
          >
            Tasks
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "assign" && (
          <div>
            {!canManageMembers ? (
              <div className="p-6 bg-white border border-[#D1D5DB] rounded-lg">
                <p className="text-gray-600">
                  Only owner or senior can assign tasks.
                </p>
              </div>
            ) : (
              <TaskForm
                project={project}
                onCreated={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["project-tasks", projectId],
                  });
                }}
              />
            )}
          </div>
        )}

        {activeTab === "mytasks" && (
          <TaskList
            project={project}
            tasks={tasks}
            currentUser={currentUser}
            onUpdated={() =>
              queryClient.invalidateQueries({
                queryKey: ["project-tasks", projectId],
              })
            }
          />
        )}
      </div>

      {/* NEW — Members Modal */}
      {membersModalOpen && (
        <ProjectMembersModal
          project={project}
          onClose={() => setMembersModalOpen(false)}
        />
      )}
    </div>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";

/* ---------------------------------------
   Get Single Project
-----------------------------------------*/
export const useProject = (projectId: string) =>
  useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data;
    },
    enabled: !!projectId, // prevents running with undefined id
  });

/* ---------------------------------------
   Get Tasks for Project
-----------------------------------------*/
export const useProjectTasks = (projectId: string) =>
  useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/tasks`);
      return res.data;
    },
    enabled: !!projectId,
  });

/* ---------------------------------------
   Get Current User (/users/me)
-----------------------------------------*/
export const useUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
  });

/* ---------------------------------------
   Create Task
-----------------------------------------*/
export const useCreateTask = (projectId: string) =>
  useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post(`/projects/${projectId}/tasks`, payload);
      return res.data;
    },
  });

/* ---------------------------------------
   Update Task (progress, branch, assignee)
-----------------------------------------*/
export const useUpdateTask = () =>
  useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: any;
    }) => {
      const res = await api.patch(`/tasks/${taskId}`, updates);
      return res.data;
    },
  });

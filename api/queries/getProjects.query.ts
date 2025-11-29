import { useQuery } from "@tanstack/react-query";
import api from "../axios/axios.interceptor";



export interface Project {
  _id: string;
  name: string;
  repoUrl: string;
  owner: string;
  members: string[];
  inviteToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProjectsResponse {
  success: boolean;
  statusCode: number;
  data: Project[];
}


export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<ProjectsResponse> => {
      const response = await api.get("/projects");
      return response.data;
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import api from "../axios/axios.interceptor";



interface Project {
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

interface CreateProjectData {
    name: string;
    repoUrl: string;
    emails: string[];
}
interface CreateProjectResponse {
    success: boolean;
    statusCode: number;
    data: Project;
}
export const useCreateProject = () => {
    return useMutation({
        mutationFn: async (projectData: CreateProjectData): Promise<CreateProjectResponse> => {
            const response = await api.post('/projects', projectData);

            return response.data;
        },
    });
};
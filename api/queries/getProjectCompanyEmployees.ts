import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";

export const useProjectCompanyEmployees = (projectId: string) => {
  return useQuery({
    queryKey: ["project-company-employees", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/company-employees`);
      return res.data?.data || [];
    },
  });
};

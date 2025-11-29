import { useQuery } from "@tanstack/react-query";
import api from "../axios/axios.interceptor";



interface UserSearchResponse {
  data: {
    found: boolean;
  };
}
export const useSearchUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ['user-search', email],
    queryFn: async (): Promise<UserSearchResponse> => {
      const response = await api.get(`/projects/user-by-email?email=${email}`);
      return response.data;
    },
    enabled: !!email, // Only run query if email is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
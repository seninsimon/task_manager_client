import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
  });
};

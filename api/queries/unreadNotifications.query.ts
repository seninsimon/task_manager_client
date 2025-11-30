    import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count");
      return res.data.count || 0;
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios/axios.interceptor";

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const res = await api.post("/projects/invites/accept", { token });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

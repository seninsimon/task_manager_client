import { useMutation } from "@tanstack/react-query";
import api from "../axios/axios.interceptor";

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
  });
}

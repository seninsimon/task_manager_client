import { useMutation } from "@tanstack/react-query";
import api from "../axios/axios.interceptor";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await api.post("/auth/register", data);
      return res.data; 
    },

    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=3600;`;
      window.location.href = "/dashboard";
    },

    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
}

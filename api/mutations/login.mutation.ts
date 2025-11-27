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

    onSuccess: (data) => {

      console.log(data);
      localStorage.setItem("accessToken", data.data.accessToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=3600;`;
      window.location.href = "/dashboard";
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

"use client";

import { useState } from "react";
import { useLogin } from "@/api/mutations/login.mutation";

export default function Login() {
  const { mutate: loginMutation, isPending, error, isSuccess } = useLogin();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-inter">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-[#1F2937]">
          Login
        </h2>

        <div className="space-y-4">
          {/* Email */}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1F2937]"
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1F2937]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 mt-2 bg-[#1F2937] text-white rounded-lg text-sm font-medium hover:bg-[#111827] transition"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {(error as any)?.response?.data?.message ||
              "Something went wrong"}
          </p>
        )}

        {isSuccess && (
          <p className="text-green-600 text-sm mt-2">
            Login successful!
          </p>
        )}
      </form>
    </div>
  );
}

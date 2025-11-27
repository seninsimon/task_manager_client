"use client";

import { useState } from "react";
import { useRegister } from "@/api/mutations/register.mutation";

export default function Register() {
  const { mutate: registerMutation , isPending , error , isSuccess } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-inter">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-[#1F2937]">
          Create Account
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1F2937]"
            required
          />

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
          {isPending ? "Creating..." : "Register"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {(error as any)?.response?.data?.message ||
              "Something went wrong"}
          </p>
        )}

        {isSuccess && (
          <p className="text-green-600 text-sm mt-2">
            Account created successfully!
          </p>
        )}
      </form>
    </div>
  );
}

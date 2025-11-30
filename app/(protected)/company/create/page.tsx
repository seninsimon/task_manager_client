  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import api from "@/api/axios/axios.interceptor";

  export default function CreateCompanyPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const createCompany = async () => {
      try {
        setLoading(true);
        const res = await api.post("/companies", { name });
        if (res.data.success) router.push("/company");
      } catch (error) {
        console.error("Create company error:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex justify-center items-center h-full p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-[#D1D5DB] space-y-4">
          <h1 className="text-xl font-semibold text-[#1F2937]">
            Create Your Company
          </h1>

          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-3 text-sm focus:shadow-sm transition"
          />

          <button
            onClick={createCompany}
            disabled={!name || loading}
            className="w-full bg-[#1F2937] text-white p-3 rounded-lg text-sm hover:bg-[#111827] transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </div>
      </div>
    );
  }

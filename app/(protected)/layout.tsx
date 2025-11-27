import Sidebar from "@/components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen font-inter bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

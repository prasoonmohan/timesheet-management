import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-17 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="text-[24px] font-semibold leading-none text-[#111928]">
              ticktock
            </span>

            <span className="text-sm text-[#111827]">
              Timesheets
            </span>
          </div>

          <LogoutButton />
        </div>
      </header>

      {children}

      <div className="mx-auto max-w-[1280px] p-7 pt-0">
        <footer className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-xs text-[#6B7280]">
            © 2024 tentwenty. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

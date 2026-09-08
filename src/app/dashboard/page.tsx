import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
      <div className="rounded-lg border border-[#e2e5e9] bg-white p-8">
        <h1 className="text-xl font-semibold text-[#172033]">
          Welcome to ticktock
        </h1>

        <p className="mt-2 text-sm text-[#667085]">
          You are successfully authenticated.
        </p>

        <p className="mt-4 text-sm text-[#667085]">
          Signed in as: {session.user?.email}
        </p>
      </div>
    </main>
  );
}
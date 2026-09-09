import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#F8F8F8] p-6"><section className="max-w-md rounded-lg border border-[#E5E7EB] bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold text-[#1C64F2]">404</p><h1 className="mt-2 text-xl font-bold text-[#111928]">Page not found</h1><p className="mt-2 text-sm text-[#6B7280]">The page you requested does not exist or has moved.</p><Link href="/dashboard" className="mt-5 inline-block rounded-md bg-[#1C64F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1447E6]">Go to timesheets</Link></section></main>;
}

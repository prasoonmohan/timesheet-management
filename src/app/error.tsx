"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-[#F8F8F8] p-6"><section className="max-w-md rounded-lg border border-[#E5E7EB] bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-[#111928]">Something went wrong</h1><p className="mt-2 text-sm text-[#6B7280]">We could not load this page. Please try again.</p><button type="button" onClick={reset} className="mt-5 rounded-md bg-[#1C64F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1447E6]">Try again</button></section></main>;
}

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[14px] font-medium text-[#111928]"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10.5 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 text-[12px] text-[#111928] outline-none transition placeholder:text-[#6B7280] focus:border-[#1C64F2] focus:ring-1 focus:ring-[#1C64F2]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[14px] font-medium text-[#111928]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
            className="h-10.5 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 text-[12px] text-[#111928] outline-none transition placeholder:text-[#6B7280] focus:border-[#1C64F2] focus:ring-1 focus:ring-[#1C64F2]"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded-sm border-[#D1D5DB] accent-[#1C64F2]"
          />

          <span className="text-[14px] text-[#6B7280] font-medium">
            Remember me
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-[5px] bg-red-50 px-3 py-2 text-[11px] text-red-600"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-lg bg-[#1A56DB] text-[14px] font-medium text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1C64F2] focus:ring-offset-2"
        >
           {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
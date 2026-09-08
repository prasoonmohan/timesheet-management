import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen md:grid-cols-2">
        {/* Login section */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 md:px-12 lg:px-18">
          <div className="w-full max-w-[576px]">
            <h1 className="mb-5 text-[20px] font-bold text-[#111928]">
              Welcome back
            </h1>

            <LoginForm />
          </div>
        </section>

        {/* Branding section */}
        <section className="hidden min-h-screen items-center bg-[#1C64F2] px-12 md:flex lg:px-16">
          <div className="max-w-[576px] mx-auto">
            <h2 className="mb-3 text-[40px] font-semibold text-white">
              ticktock
            </h2>

            <p className="text-[16px] leading-[1.7] text-[#E5E7EB] font-light">
              Introducing ticktock, our cutting-edge timesheet web
              application designed to revolutionize how you manage
              employee work hours. With ticktock, you can effortlessly
              track and monitor employee attendance and productivity
              from anywhere, anytime, using any internet-connected
              device.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
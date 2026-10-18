import { signIn } from "@/auth";
import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel: Rich Brand Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#170A51] flex-col justify-center p-12 text-white relative overflow-hidden">
        <Image
          src="/logo/logo-transparent.png"
          alt="ULES Logo Background"
          width={800}
          height={800}
          className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-5 pointer-events-none w-[800px] h-auto"
        />
        <div className="max-w-lg relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <h1 className="text-5xl lg:text-6xl font-['Anton'] uppercase tracking-wider leading-tight">
              University of Lagos<br />Engineering Society
            </h1>
          </div>
          <p className="text-xl font-['Neue_Machina'] text-[#CBD5E1] leading-relaxed">
            Secure Administrator Portal. Manage events, student aids, associations, and news from a central unified dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Card */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-8 overflow-hidden min-h-screen lg:min-h-0">
        {/* Mobile Watermark Logo */}
        <div className="lg:hidden absolute -bottom-10 -right-10 xs:-bottom-14 xs:-right-14 pointer-events-none select-none z-0">
          <Image
            src="/logo/logo-transparent.png"
            alt="ULES Logo Watermark"
            width={600}
            height={600}
            className="w-[390px] xs:w-[460px] sm:w-[520px] h-auto opacity-15 pointer-events-none translate-x-1/6 translate-y-1/6"
            priority
          />
        </div>

        <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-['Anton'] text-[#106333] tracking-wide mb-3">
              ADMIN PORTAL
            </h2>
            <p className="font-['Neue_Machina'] text-gray-500">
              Sign in to access the admin dashboard.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-[#170A51] hover:bg-[#22203E] text-white py-4 px-6 rounded-lg transition-colors font-['Neue_Machina'] font-medium"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
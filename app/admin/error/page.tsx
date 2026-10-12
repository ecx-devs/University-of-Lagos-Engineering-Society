"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
      <div className="flex justify-center mb-6">
        <Image 
          src="/logo/logo-transparent.png" 
          alt="ULES Logo" 
          width={80} 
          height={80} 
          className="w-20 h-20 object-contain"
        />
      </div>
      <h2 className="text-3xl font-['Anton'] text-red-600 tracking-wide mb-3">
        {error === "AccessDenied" ? "ACCESS DENIED" : "AUTHENTICATION ERROR"}
      </h2>
      <p className="font-['Neue_Machina'] text-gray-500 mb-8">
        {error === "AccessDenied" 
          ? "Your account has not been whitelisted for administrative access. Please contact the Superadmin."
          : "An error occurred during authentication."}
      </p>
      
      <Link
        href="/admin/login"
        className="inline-flex w-full justify-center items-center gap-3 bg-[#170A51] hover:bg-[#22203E] text-white py-4 px-6 rounded-lg transition-colors font-['Neue_Machina'] font-medium"
      >
        Go back to Login Page
      </Link>
    </div>
  );
}

export default function AdminErrorPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500">Loading error page...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}

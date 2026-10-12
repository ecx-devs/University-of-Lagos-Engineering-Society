import Link from 'next/link';
import { Construction, ArrowLeft, LayoutDashboard, Building2 } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center font-['Neue_Machina'] px-4 py-12">
      <div className="w-full max-w-xl text-center space-y-6 bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#C85B15] to-transparent" />


        <div className="flex justify-center">
          <div className="relative">
            <div className="size-20 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#C85B15] shadow-xs">
              <Construction className="size-10" />
            </div>
          </div>
        </div>


        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          Module In Progress
        </div>


        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Settings Under Construction
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            This section is currently being built and configured. System settings and platform preferences will be accessible here once maintenance and development are finalized.
          </p>
        </div>


        <div className="border-t border-gray-100 pt-6" />


        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#170A51] text-white text-xs font-semibold hover:bg-[#22203E] transition-colors shadow-xs"
          >
            <LayoutDashboard className="size-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/admin/associations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            <Building2 className="size-4 text-[#106333]" />
            Associations & Roster
          </Link>
        </div>
      </div>
    </div>
  );
}

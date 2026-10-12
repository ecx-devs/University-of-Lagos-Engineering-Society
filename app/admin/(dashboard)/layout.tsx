import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const isSuperAdmin = session?.user?.email === superAdminEmail;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Neue_Machina']">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#170A51] flex flex-col text-white flex-shrink-0">
        <div className="h-16 flex items-center px-6 bg-[#22203E] border-b border-[#22203E]">
          <span className="font-['Anton'] text-2xl tracking-widest text-white">
            ULES ADMIN
          </span>
        </div>

        <SidebarNav isSuperAdmin={isSuperAdmin} />

        <div className="p-4 border-t border-[#22203E]">
          <div className="text-xs text-gray-400 text-center mb-2">Logged in as</div>
          <div className="truncate text-sm font-medium text-center text-gray-200">
            {session?.user?.email}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="font-['Anton'] text-xl text-[#106333] tracking-wide">
            Dashboard
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {session?.user?.name || "Administrator"}
              </span>
            </div>
            
            <div className="w-px h-6 bg-gray-200" />
            
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button 
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#C85B15] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

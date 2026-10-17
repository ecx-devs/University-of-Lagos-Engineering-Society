import { auth, signOut } from "@/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const isSuperAdmin = session?.user?.email === superAdminEmail;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <AdminShell
      isSuperAdmin={isSuperAdmin}
      userEmail={session?.user?.email}
      userName={session?.user?.name}
      userImage={session?.user?.image}
      signOutAction={handleSignOut}
    >
      {children}
    </AdminShell>
  );
}

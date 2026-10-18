import { auth, signOut } from "@/auth";
import AdminShell from "./AdminShell";
import prisma from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const dbAdmin = session?.user?.email
    ? await prisma.admin.findUnique({
        where: { email: session.user.email },
      })
    : null;
  const isSuperAdmin = dbAdmin?.role === "SUPERADMIN";

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

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import AdminClientTable from './AdminClientTable';
import { redirect } from 'next/navigation';

export default async function AdminsPage() {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const isSuperAdmin = session?.user?.email === superAdminEmail;

  if (!isSuperAdmin) {
    redirect('/admin');
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 font-['Neue_Machina']">
      <div>
        <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide">
          Manage Administrators
        </h1>
        <p className="text-gray-500 mt-2">
          View and manage the users who have access to this portal. 
          {isSuperAdmin && " As the Super Administrator, you can grant access to new users."}
        </p>
      </div>

      <AdminClientTable 
        admins={admins} 
        isSuperAdmin={isSuperAdmin} 
        superAdminEmail={superAdminEmail} 
      />
    </div>
  );
}

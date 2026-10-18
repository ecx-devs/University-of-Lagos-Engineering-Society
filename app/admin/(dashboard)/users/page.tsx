import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import AdminClientTable from './AdminClientTable';
import { redirect } from 'next/navigation';

export default async function AdminsPage() {
  const session = await auth();
  const dbAdmin = session?.user?.email
    ? await prisma.admin.findUnique({
        where: { email: session.user.email },
      })
    : null;
  const isSuperAdmin = dbAdmin?.role === 'SUPERADMIN';

  if (!isSuperAdmin) {
    redirect('/admin');
  }

  const admins = await prisma.admin.findMany({
    orderBy: [{ role: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-8 font-['Neue_Machina']">
      <div>
        <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide">
          Manage Administrators
        </h1>
        <p className="text-gray-500 mt-2">
          View and manage the administrators who have access to this portal. 
          {isSuperAdmin && ' As a Super Administrator, you can invite new administrators, manage permissions, or transfer the Superadmin role.'}
        </p>
      </div>

      <AdminClientTable 
        admins={admins} 
        isSuperAdmin={isSuperAdmin} 
        currentAdminEmail={session?.user?.email || ''} 
      />
    </div>
  );
}

'use server';

import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { auth } from '@/auth';

export async function createAdmin(formData: FormData) {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;

  // Security Check: Only the SuperAdmin can create other admins
  if (!session?.user?.email || session.user.email !== superAdminEmail) {
    throw new Error('Unauthorized: Only the Super Admin can create new administrators.');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    throw new Error('An administrator with this email already exists.');
  }

  // Create the new admin in the database
  await prisma.admin.create({
    data: {
      name,
      email,
      role: 'ADMIN'
    }
  });

  // Send them an email letting them know they have access
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    await resend.emails.send({
      from: `ULES System <${fromEmail}>`,
      to: email,
      subject: 'You have been made a ULES Administrator',
      html: `
        <h3>Welcome to the ULES Admin Portal</h3>
        <p>Hello ${name},</p>
        <p>The Super Administrator has granted you access to the ULES backend system.</p>
        <p>You can now log in using this Google account by visiting:</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/login">Log in to the Admin Dashboard</a></p>
      `
    });
  }

  return { success: true };
}

export async function editAdmin(id: string, formData: FormData) {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;

  // Security Check
  if (!session?.user?.email || session.user.email !== superAdminEmail) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  await prisma.admin.update({
    where: { id },
    data: { name, email },
  });

  return { success: true };
}

export async function deleteAdmin(id: string) {
  const session = await auth();
  const superAdminEmail = process.env.SUPERADMIN_EMAIL;

  // Security Check
  if (!session?.user?.email || session.user.email !== superAdminEmail) {
    throw new Error('Unauthorized');
  }

  await prisma.admin.delete({
    where: { id },
  });

  return { success: true };
}
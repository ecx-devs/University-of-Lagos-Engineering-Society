'use server';

import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { auth } from '@/auth';
import { SITE_URL } from '@/components/constants/sites';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

async function getCallerSuperAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Unauthorized: Authentication required.');
  }

  const caller = await prisma.admin.findUnique({
    where: { email: session.user.email },
  });

  if (!caller || caller.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized: Only a Super Administrator can perform this action.');
  }

  return caller;
}

export async function createAdmin(formData: FormData) {
  const caller = await getCallerSuperAdmin();

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error('An administrator with this email already exists.');
  }

  const newAdmin = await prisma.admin.create({
    data: {
      name,
      email,
      role: 'ADMIN',
    },
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `ULES System <${fromEmail}>`,
        to: email,
        subject: 'You have been made a ULES Administrator',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #170A51; margin-top: 0;">Welcome to the ULES Admin Portal</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>A Super Administrator has granted you administrative access to the ULES backend system.</p>
            <p>You can now log in using your Google account by clicking below:</p>
            <p style="margin: 24px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || SITE_URL}/admin/login" style="background-color: #170A51; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Log In to Admin Dashboard
              </a>
            </p>
            <p style="color: #64748B; font-size: 13px;">If you have any questions, please reach out to the ULES administrative team.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send invitation email:', emailErr);
    }
  }

  revalidatePath('/admin/users');
  return { success: true, admin: newAdmin };
}

export async function editAdmin(id: string, formData: FormData) {
  const caller = await getCallerSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    throw new Error('Administrator not found.');
  }

  // Rule: A SuperAdmin cannot edit another SuperAdmin's details
  if (target.role === 'SUPERADMIN' && target.id !== caller.id) {
    throw new Error('Forbidden: A Super Administrator cannot edit another Super Administrator.');
  }

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  // Check if new email is taken by someone else
  if (email !== target.email) {
    const emailConflict = await prisma.admin.findUnique({ where: { email } });
    if (emailConflict) {
      throw new Error('An administrator with this email address already exists.');
    }
  }

  await prisma.admin.update({
    where: { id },
    data: { name, email },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteAdmin(id: string) {
  const caller = await getCallerSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    throw new Error('Administrator not found.');
  }

  // Rule: A SuperAdmin cannot delete/revoke another SuperAdmin
  if (target.role === 'SUPERADMIN') {
    throw new Error('Forbidden: A Super Administrator cannot delete or revoke a Super Administrator.');
  }

  await prisma.admin.delete({
    where: { id },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

/**
 * Generates and emails a 5-minute confirmation OTP to the calling Superadmin
 * to authorize making a normal admin a Superadmin.
 */
export async function requestSuperAdminTransferOtp(targetAdminId: string) {
  const caller = await getCallerSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id: targetAdminId } });
  if (!target) {
    throw new Error('Target administrator not found.');
  }

  if (target.role === 'SUPERADMIN') {
    throw new Error('This user is already a Super Administrator.');
  }

  // Generate a random 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Clean up any existing unexpired OTPs for this caller & target
  await prisma.$executeRaw`
    DELETE FROM "SuperAdminOtp"
    WHERE "email" = ${caller.email} AND "targetId" = ${targetAdminId}
  `;

  // Store new OTP in database
  const otpId = crypto.randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "SuperAdminOtp" ("id", "email", "targetId", "code", "expiresAt", "createdAt")
    VALUES (${otpId}, ${caller.email}, ${targetAdminId}, ${code}, ${expiresAt}, NOW())
  `;

  // Send verification code via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `ULES Security <${fromEmail}>`,
        to: caller.email,
        subject: 'Security Verification: Confirm Superadmin Role Transfer',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #170A51; margin: 0 0 6px 0; font-size: 22px;">Superadmin Role Transfer Request</h2>
              <p style="color: #64748B; font-size: 14px; margin: 0;">University of Lagos Engineering Society</p>
            </div>

            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              Hello <strong>${caller.name || 'Super Administrator'}</strong>,
            </p>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              You have initiated a request to transfer your <strong>Super Administrator</strong> role to <strong>${target.name || target.email}</strong> (${target.email}).
            </p>

            <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 16px; margin: 20px 0; border-radius: 6px;">
              <p style="color: #92400E; font-size: 13px; font-weight: 700; margin: 0 0 4px 0;">⚠️ Security Notice</p>
              <p style="color: #B45309; font-size: 13px; margin: 0; line-height: 1.5;">
                Upon completing this verification, <strong>your account will immediately become a standard Administrator</strong>, and ${target.name || target.email} will become a Super Administrator.
              </p>
            </div>

            <p style="color: #475569; font-size: 14px; margin-bottom: 8px;">Here is your 6-digit confirmation code:</p>

            <div style="text-align: center; margin: 28px 0;">
              <span style="display: inline-block; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #170A51; background: #F8FAFC; padding: 14px 28px; border-radius: 10px; border: 2px dashed #CBD5E1; font-family: monospace;">
                ${code}
              </span>
            </div>

            <p style="color: #64748B; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
              This code will expire in <strong>5 minutes</strong>.<br />
              If you did not initiate this action, please ignore this email and verify your account security immediately.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send OTP verification email:', emailErr);
    }
  }

  return { success: true, message: 'Verification code sent to your email.' };
}

/**
 * Verifies OTP and executes the atomic role transfer:
 * - Target admin becomes SUPERADMIN
 * - Initiating caller becomes standard ADMIN
 * - OTP is invalidated
 */
export async function confirmSuperAdminTransfer(targetAdminId: string, otp: string) {
  const caller = await getCallerSuperAdmin();

  const target = await prisma.admin.findUnique({ where: { id: targetAdminId } });
  if (!target) {
    throw new Error('Target administrator not found.');
  }

  if (target.role === 'SUPERADMIN') {
    throw new Error('This user is already a Super Administrator.');
  }

  const cleanOtp = otp.trim();
  if (!cleanOtp) {
    throw new Error('Verification code is required.');
  }

  // Find the matching unexpired OTP
  const otpRows = await prisma.$queryRaw<Array<{ id: string; code: string; expiresAt: Date }>>`
    SELECT "id", "code", "expiresAt"
    FROM "SuperAdminOtp"
    WHERE "email" = ${caller.email} AND "targetId" = ${targetAdminId} AND "code" = ${cleanOtp}
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;

  const otpRecord = otpRows[0];

  if (!otpRecord) {
    throw new Error('Invalid verification code. Please check your email and try again.');
  }

  if (new Date() > new Date(otpRecord.expiresAt)) {
    await prisma.$executeRaw`
      DELETE FROM "SuperAdminOtp" WHERE "id" = ${otpRecord.id}
    `;
    throw new Error('Verification code has expired. Please request a new code.');
  }

  // Perform atomic role transfer
  await prisma.$transaction([
    // 1. Promote target to SUPERADMIN
    prisma.admin.update({
      where: { id: targetAdminId },
      data: { role: 'SUPERADMIN' },
    }),
    // 2. Demote caller to ADMIN
    prisma.admin.update({
      where: { id: caller.id },
      data: { role: 'ADMIN' },
    }),
    // 3. Clear all OTPs for caller
    prisma.$executeRaw`
      DELETE FROM "SuperAdminOtp"
      WHERE "email" = ${caller.email}
    `,
  ]);

  // Send confirmation emails
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      // To new Superadmin
      await resend.emails.send({
        from: `ULES System <${fromEmail}>`,
        to: target.email,
        subject: 'You have been promoted to Super Administrator',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #106333;">Super Administrator Access Granted</h2>
            <p>Hello <strong>${target.name || 'Administrator'}</strong>,</p>
            <p>You have been elevated to <strong>Super Administrator</strong> on the ULES Admin Portal by ${caller.name || caller.email}.</p>
            <p>You now possess full administrative authority, including administrator management and portal governance.</p>
            <p style="margin: 24px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || SITE_URL}/admin/users" style="background-color: #170A51; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Access Administrator Management
              </a>
            </p>
          </div>
        `,
      });

      // To previous Superadmin (now Admin)
      await resend.emails.send({
        from: `ULES Security <${fromEmail}>`,
        to: caller.email,
        subject: 'Superadmin Role Transfer Completed',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #170A51;">Role Transfer Confirmed</h2>
            <p>Hello <strong>${caller.name || 'Administrator'}</strong>,</p>
            <p>Your transfer of the Super Administrator role to <strong>${target.name || target.email}</strong> (${target.email}) has been successfully processed.</p>
            <p>Your account is now configured as a standard <strong>Administrator</strong>.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send confirmation emails:', err);
    }
  }

  revalidatePath('/admin');
  revalidatePath('/admin/users');

  return { success: true, message: 'Superadmin privileges successfully transferred.' };
}
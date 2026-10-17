'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getGlobalAcademicSession } from '@/app/actions/associations';

export type ExecutiveLeaderData = {
  id: string;
  name: string;
  title: string;
  department: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  order: number;
  session: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllExecutiveLeaders(): Promise<ExecutiveLeaderData[]> {
  try {
    return await prisma.executiveLeader.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (error) {
    console.error('Failed to fetch executive leaders from DB:', error);
    return [];
  }
}


export async function getPublicExecutiveLeaders(): Promise<ExecutiveLeaderData[]> {
  try {
    return await prisma.executiveLeader.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (error) {
    console.error('Failed to fetch public executive leaders from DB:', error);
    return [];
  }
}


export async function createOrUpdateExecutiveLeader(data: {
  id?: string;
  name: string;
  title: string;
  department: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  order?: number;
  isPublished?: boolean;
}): Promise<{ success: boolean; leader?: ExecutiveLeaderData; error?: string }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  const { id, name, title, department, phoneNumber, email, imageUrl, order, isPublished } = data;

  if (!name?.trim() || !title?.trim()) {
    return { success: false, error: 'Name and Title (Office/Role) are required.' };
  }

  const activeSession = await getGlobalAcademicSession();

  try {
    if (id) {
      const updated = await prisma.executiveLeader.update({
        where: { id },
        data: {
          name: name.trim(),
          title: title.trim(),
          department: department?.trim() || '',
          phoneNumber: phoneNumber?.trim() || '',
          email: email?.trim() || '',
          imageUrl: imageUrl?.trim() || '/logo/logo-transparent.png',
          session: activeSession,
          ...(typeof order === 'number' ? { order } : {}),
          ...(typeof isPublished === 'boolean' ? { isPublished } : {}),
        },
      });

      revalidatePath('/about/leadership');
      revalidatePath('/admin/leadership');
      revalidatePath('/admin');
      return { success: true, leader: updated };
    } else {
      let nextOrder = typeof order === 'number' ? order : 0;
      if (typeof order !== 'number') {
        const lastLeader = await prisma.executiveLeader.findFirst({
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        nextOrder = (lastLeader?.order ?? -1) + 1;
      }

      const created = await prisma.executiveLeader.create({
        data: {
          name: name.trim(),
          title: title.trim(),
          department: department?.trim() || '',
          phoneNumber: phoneNumber?.trim() || '',
          email: email?.trim() || '',
          imageUrl: imageUrl?.trim() || '/logo/logo-transparent.png',
          order: nextOrder,
          session: activeSession,
          isPublished: isPublished ?? true,
        },
      });

      revalidatePath('/about/leadership');
      revalidatePath('/admin/leadership');
      revalidatePath('/admin');
      return { success: true, leader: created };
    }
  } catch (error: any) {
    console.error('Error saving executive leader:', error);
    return { success: false, error: error?.message || 'Database error while saving leader.' };
  }
}

/**
 * Reorder executive leaders by saving their new sequential indices.
 */
export async function reorderExecutiveLeaders(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { success: false, error: 'Invalid order list provided.' };
  }

  try {
    const updates = orderedIds.map((id, index) =>
      prisma.executiveLeader.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath('/about/leadership');
    revalidatePath('/admin/leadership');
    return { success: true };
  } catch (error: any) {
    console.error('Error reordering executive leaders:', error);
    return { success: false, error: error?.message || 'Failed to persist new order.' };
  }
}

export async function deleteExecutiveLeader(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  try {
    await prisma.executiveLeader.delete({
      where: { id },
    });

    revalidatePath('/about/leadership');
    revalidatePath('/admin/leadership');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting executive leader:', error);
    return { success: false, error: error?.message || 'Failed to delete leader.' };
  }
}

export async function toggleExecutiveLeaderPublished(
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  try {
    await prisma.executiveLeader.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath('/about/leadership');
    revalidatePath('/admin/leadership');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling leader published status:', error);
    return { success: false, error: error?.message || 'Failed to update publication status.' };
  }
}

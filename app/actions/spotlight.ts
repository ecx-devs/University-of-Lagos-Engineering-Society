'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type SpotlightType = 'volunteer' | 'lecturer';

export async function getSpotlights() {
  return await prisma.spotlight.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getActiveSpotlights() {
  const volunteer = await prisma.spotlight.findFirst({
    where: {
      type: 'volunteer',
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const lecturer = await prisma.spotlight.findFirst({
    where: {
      type: 'lecturer',
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { volunteer, lecturer };
}

export async function createOrUpdateSpotlight(data: {
  id?: string;
  type: SpotlightType;
  monthYear: string;
  name: string;
  departmentOrRole: string;
  story: string;
  imageUrl: string;
  isPublished: boolean;
}) {
  const { id, ...rest } = data;

  if (id) {
    await prisma.spotlight.update({
      where: { id },
      data: rest,
    });
  } else {
    await prisma.spotlight.create({
      data: rest,
    });
  }

  revalidatePath('/admin/spotlights');
  revalidatePath('/spotlight');
  
  return { success: true };
}

export async function toggleSpotlightPublished(id: string, isPublished: boolean) {
  await prisma.spotlight.update({
    where: { id },
    data: { isPublished },
  });
  revalidatePath('/admin/spotlights');
  revalidatePath('/spotlight');
}

export async function deleteSpotlight(id: string) {
  await prisma.spotlight.delete({
    where: { id },
  });
  revalidatePath('/admin/spotlights');
  revalidatePath('/spotlight');
}

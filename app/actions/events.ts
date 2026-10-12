'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

export interface EventFormData {
  id?: string;
  title: string;
  slug?: string;
  frequency: string;
  date: string | Date;
  time?: string | null;
  venue: string;
  description: string;
  coverImageUrl: string;
}

export async function getEvents() {
  try {
    return await prisma.event.findMany({
      include: {
        _count: {
          select: { galleryImages: true },
        },
        galleryImages: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
}

export async function getUpcomingEvents() {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        date: {
          gte: now,
        },
      },
      include: {
        _count: {
          select: { galleryImages: true },
        },
        galleryImages: {
          take: 4,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

export async function getPastEvents() {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        date: {
          lt: now,
        },
      },
      include: {
        _count: {
          select: { galleryImages: true },
        },
        galleryImages: {
          take: 4,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
}

export async function getGalleryEvents() {
  try {
    return await prisma.event.findMany({
      where: {
        galleryImages: {
          some: {},
        },
      },
      include: {
        galleryImages: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { galleryImages: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    return [];
  }
}

export async function getEventBySlug(slug: string) {
  try {
    return await prisma.event.findUnique({
      where: { slug },
      include: {
        galleryImages: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { galleryImages: true },
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching event by slug ${slug}:`, error);
    return null;
  }
}

export async function createOrUpdateEvent(data: EventFormData) {
  const { id, title, frequency, time, venue, description, coverImageUrl } = data;


  let slug = data.slug ? slugify(data.slug) : slugify(title);
  if (!slug) slug = `event-${Date.now()}`;

  const eventDate = new Date(data.date);


  const existingWithSlug = await prisma.event.findUnique({
    where: { slug },
  });

  if (existingWithSlug && (!id || existingWithSlug.id !== id)) {

    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  let result;
  if (id) {
    result = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        frequency: frequency || 'Annual Event',
        date: eventDate,
        time: time || null,
        venue,
        description,
        coverImageUrl,
      },
      include: {
        galleryImages: true,
      },
    });
  } else {
    result = await prisma.event.create({
      data: {
        title,
        slug,
        frequency: frequency || 'Annual Event',
        date: eventDate,
        time: time || null,
        venue,
        description,
        coverImageUrl,
      },
      include: {
        galleryImages: true,
      },
    });
  }

  revalidatePath('/activities/events');
  revalidatePath(`/activities/events/${slug}`);
  revalidatePath('/activities/gallery');
  revalidatePath(`/activities/gallery/${slug}`);
  revalidatePath('/admin/events');

  return result;
}

export async function deleteEvent(id: string) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return null;

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath('/activities/events');
  revalidatePath(`/activities/events/${event.slug}`);
  revalidatePath('/activities/gallery');
  revalidatePath(`/activities/gallery/${event.slug}`);
  revalidatePath('/admin/events');

  return { success: true };
}

export async function addGalleryImages(eventId: string, imageUrls: string[]) {
  if (!imageUrls.length) return [];

  const created = await prisma.$transaction(
    imageUrls.map((imageUrl) =>
      prisma.eventGalleryImage.create({
        data: {
          eventId,
          imageUrl,
        },
      })
    )
  );

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (event) {
    revalidatePath('/activities/events');
    revalidatePath(`/activities/events/${event.slug}`);
    revalidatePath('/activities/gallery');
    revalidatePath(`/activities/gallery/${event.slug}`);
    revalidatePath('/admin/events');
  }

  return created;
}

export async function deleteGalleryImage(imageId: string) {
  const image = await prisma.eventGalleryImage.findUnique({
    where: { id: imageId },
    include: { event: true },
  });

  if (!image) return null;

  await prisma.eventGalleryImage.delete({
    where: { id: imageId },
  });

  if (image.event) {
    revalidatePath('/activities/events');
    revalidatePath(`/activities/events/${image.event.slug}`);
    revalidatePath('/activities/gallery');
    revalidatePath(`/activities/gallery/${image.event.slug}`);
    revalidatePath('/admin/events');
  }

  return { success: true };
}

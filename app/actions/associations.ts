'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import {
  getAllBodies,
  getBodyBySlug,
  CURRENT_ACADEMIC_SESSION,
  type AssociationBody,
} from '@/components/constants';

export interface LeaderRecord {
  slug: string;
  name: string;
  title: string;
  session: string;
  bodyName: string;
  typeLabel: string;
  acronym: string;
  imageSrc: string;
}


export async function getGlobalAcademicSession(): Promise<string> {
  try {
    const result = await prisma.$queryRaw<Array<{ value: string }>>`
      SELECT "value" FROM "GlobalSetting" WHERE "key" = 'academic_session' LIMIT 1
    `;
    if (result && result.length > 0 && result[0].value) {
      return result[0].value;
    }
  } catch (error) {
    console.error('Failed to read global academic session from DB:', error);
  }
  return CURRENT_ACADEMIC_SESSION;
}


export async function updateGlobalAcademicSession(newSession: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  const cleanSession = newSession.trim();
  if (!cleanSession) {
    return { success: false, error: 'Academic session cannot be empty.' };
  }

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "GlobalSetting" ("key", "value", "updatedAt")
       VALUES ('academic_session', $1, NOW())
       ON CONFLICT ("key") DO UPDATE SET "value" = $1, "updatedAt" = NOW()`,
      cleanSession
    );

    revalidatePath('/');
    revalidatePath('/about/leadership');
    revalidatePath('/associations');
    revalidatePath('/associations/[slug]', 'page');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/associations');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating global academic session:', error);
    return { success: false, error: error.message || 'Database error' };
  }
}


export async function getAssociationLeadersData(): Promise<{
  session: string;
  leaders: LeaderRecord[];
}> {
  const globalSession = await getGlobalAcademicSession();
  const allBodies = getAllBodies();

  let dbLeadersMap = new Map<string, { name: string; title: string; session: string }>();

  try {
    const rows = await prisma.$queryRaw<Array<{ slug: string; name: string; title: string; session: string }>>`
      SELECT "slug", "name", "title", "session" FROM "AssociationLeader"
    `;
    for (const row of rows) {
      dbLeadersMap.set(row.slug.toLowerCase(), row);
    }
  } catch (error) {
    console.error('Failed to fetch AssociationLeader from DB:', error);
  }

  const leaders: LeaderRecord[] = allBodies.map((body) => {
    const fromDb = dbLeadersMap.get(body.slug.toLowerCase());
    return {
      slug: body.slug,
      bodyName: body.name,
      acronym: body.acronym,
      typeLabel: body.typeLabel,
      imageSrc: body.imageSrc,
      name: fromDb?.name || body.president.name,
      title: fromDb?.title || body.president.title,
      session: fromDb?.session || globalSession,
    };
  });

  return { session: globalSession, leaders };
}


export async function updateAssociationLeader(data: {
  slug: string;
  name: string;
  title: string;
  session?: string;
}): Promise<{ success: boolean; error?: string }> {
  const authSession = await auth();
  if (!authSession?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  const { slug, name, title } = data;
  const currentSession = data.session || (await getGlobalAcademicSession());

  if (!slug || !name || !title) {
    return { success: false, error: 'Slug, name, and title are required.' };
  }

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AssociationLeader" ("slug", "name", "title", "session", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = $2, "title" = $3, "session" = $4, "updatedAt" = NOW()`,
      slug.toLowerCase().trim(),
      name.trim(),
      title.trim(),
      currentSession.trim()
    );

    revalidatePath('/associations');
    revalidatePath(`/associations/${slug}`);
    revalidatePath('/admin/settings');
    revalidatePath('/admin/associations');

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating leader for ${slug}:`, error);
    return { success: false, error: error.message || 'Database error' };
  }
}


export async function saveAllAssociationLeaders(data: {
  session: string;
  leaders: Array<{ slug: string; name: string; title: string }>;
}): Promise<{ success: boolean; error?: string }> {
  const authSession = await auth();
  if (!authSession?.user?.email) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  const cleanSession = data.session.trim() || CURRENT_ACADEMIC_SESSION;

  try {

    await prisma.$executeRawUnsafe(
      `INSERT INTO "GlobalSetting" ("key", "value", "updatedAt")
       VALUES ('academic_session', $1, NOW())
       ON CONFLICT ("key") DO UPDATE SET "value" = $1, "updatedAt" = NOW()`,
      cleanSession
    );


    for (const leader of data.leaders) {
      if (leader.name && leader.title) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "AssociationLeader" ("slug", "name", "title", "session", "updatedAt")
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT ("slug") DO UPDATE SET "name" = $2, "title" = $3, "session" = $4, "updatedAt" = NOW()`,
          leader.slug.toLowerCase().trim(),
          leader.name.trim(),
          leader.title.trim(),
          cleanSession
        );
      }
    }

    revalidatePath('/');
    revalidatePath('/about/leadership');
    revalidatePath('/associations');
    revalidatePath('/associations/[slug]', 'page');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/associations');

    return { success: true };
  } catch (error: any) {
    console.error('Error during bulk save of association leaders:', error);
    return { success: false, error: error.message || 'Failed to save changes' };
  }
}


export async function getAssociationBodyWithDynamicLeadership(slug: string): Promise<AssociationBody | null> {
  const staticBody = getBodyBySlug(slug);
  if (!staticBody) return null;

  try {
    const [leaderResult, sessionResult] = await Promise.all([
      prisma.$queryRaw<Array<{ name: string; title: string; session: string }>>`
        SELECT "name", "title", "session" FROM "AssociationLeader" WHERE LOWER("slug") = LOWER(${slug}) LIMIT 1
      `,
      prisma.$queryRaw<Array<{ value: string }>>`
        SELECT "value" FROM "GlobalSetting" WHERE "key" = 'academic_session' LIMIT 1
      `,
    ]);

    const activeSession =
      sessionResult && sessionResult.length > 0 && sessionResult[0].value
        ? sessionResult[0].value
        : CURRENT_ACADEMIC_SESSION;

    if (leaderResult && leaderResult.length > 0) {
      const dbLeader = leaderResult[0];
      return {
        ...staticBody,
        president: {
          name: dbLeader.name,
          title: dbLeader.title,
          academicYear: dbLeader.session || activeSession,
        },
      };
    } else {
      return {
        ...staticBody,
        president: {
          ...staticBody.president,
          academicYear: activeSession,
        },
      };
    }
  } catch (error) {
    console.error(`Error loading dynamic leadership for ${slug}:`, error);
    return staticBody;
  }
}

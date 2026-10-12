'use server';

import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';
import { aggregateFeedbacksSummary, analyzeFeedbackItem } from '@/lib/sentiment';

export async function submitFeedbackAction(payload: any) {

  if (payload.company_website?.trim() !== '') {
    return { ok: true };
  }

  try {

    await prisma.feedback.create({
      data: {
        name: payload.name || null,
        email: payload.email || null,
        subject: payload.subject,
        message: payload.message,
      },
    });


    const admins = await prisma.admin.findMany();
    const adminEmails = admins
      .map((a) => a.email)
      .filter((email) => email !== null && email !== undefined && email !== '');

    const superAdminEmail = process.env.SUPERADMIN_EMAIL;
    if (superAdminEmail && !adminEmails.includes(superAdminEmail)) {
      adminEmails.push(superAdminEmail);
    }

    if (adminEmails.length > 0 && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `ULES System <${fromEmail}>`,
        to: adminEmails,
        subject: `New Feedback Submitted: ${payload.subject}`,
        html: `
          <h3>You have received new feedback on the ULES Platform</h3>
          <p><strong>Name:</strong> ${payload.name || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${payload.email || 'No email provided'}</p>
          <p><strong>Subject:</strong> ${payload.subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
            ${payload.message}
          </blockquote>
          <p>Log in to the Admin Dashboard to view all submissions.</p>
        `,
      });
    }

    revalidatePath('/admin/submissions');
    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return { ok: false, field: 'message', title: 'Submission Failed' };
  }
}

export async function deleteFeedback(id: string) {
  const { auth } = await import('@/auth');
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  await prisma.feedback.delete({
    where: { id },
  });

  revalidatePath('/admin/submissions');
  revalidatePath('/admin');
  return { success: true };
}

export async function toggleFeedbackRead(id: string, read: boolean) {
  const { auth } = await import('@/auth');
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  await prisma.feedback.update({
    where: { id },
    data: { read },
  });

  revalidatePath('/admin/submissions');
  revalidatePath('/admin');
  return { success: true };
}

export async function markAllFeedbacksRead() {
  const { auth } = await import('@/auth');
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  await prisma.feedback.updateMany({
    data: { read: true },
  });

  revalidatePath('/admin/submissions');
  revalidatePath('/admin');
  return { success: true };
}

export interface FeedbackSummaryResult {
  success: boolean;
  isAiGenerated: boolean;
  filterTopic: string;
  summaryText: string;
  keyIssues: string[];
  commendations: string[];
  recommendations: string[];
  totalAnalyzed: number;
  sentimentOverview: ReturnType<typeof aggregateFeedbacksSummary>;
  error?: string;
}

export async function generateFeedbackSummary(filterTopic: string = 'all'): Promise<FeedbackSummaryResult> {
  const { auth } = await import('@/auth');
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const allFeedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
  });


  let targetFeedbacks = allFeedbacks;
  if (filterTopic && filterTopic !== 'all') {
    targetFeedbacks = allFeedbacks.filter((fb) => {
      const a = analyzeFeedbackItem(fb.subject, fb.message);
      return a.topic.toLowerCase() === filterTopic.toLowerCase();
    });
  }

  const localSummary = aggregateFeedbacksSummary(targetFeedbacks);

  if (targetFeedbacks.length === 0) {
    return {
      success: true,
      isAiGenerated: false,
      filterTopic,
      summaryText:
        filterTopic === 'all'
          ? 'No student submissions have been recorded yet.'
          : `No student submissions found under "${filterTopic}".`,
      keyIssues: ['No submissions in this category.'],
      commendations: [],
      recommendations: ['Feedback in this category will appear here once submitted by students.'],
      totalAnalyzed: 0,
      sentimentOverview: localSummary,
    };
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();


  if (apiKey) {
    try {
      const feedbackSnippets = targetFeedbacks
        .slice(0, 30)
        .map((f, i) => `Submission #${i + 1} (${f.subject}): ${f.message}`)
        .join('\n---\n');

      const prompt = `You are the Student Affairs Advisor for the University of Lagos Engineering Society (ULES).
Analyze the following student feedback submissions${filterTopic !== 'all' ? ` regarding ${filterTopic}` : ''} and provide a concise summary for the executive council.

Submissions:
${feedbackSnippets}

Respond strictly with valid JSON:
{
  "summaryText": "A 2-3 sentence overview of what students are saying.",
  "keyIssues": ["Top student complaint or friction point 1", "Complaint 2", "Complaint 3"],
  "commendations": ["Positive feedback or praise 1", "Positive feedback 2"],
  "recommendations": ["Recommended executive action 1", "Recommended action 2"]
}`;

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.7-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
      ];

      for (const model of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.2,
                  responseMimeType: 'application/json',
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              const parsed = JSON.parse(candidateText.replace(/```json|```/g, '').trim());
              return {
                success: true,
                isAiGenerated: true,
                filterTopic,
                summaryText: parsed.summaryText || 'Summary generated.',
                keyIssues: Array.isArray(parsed.keyIssues) ? parsed.keyIssues : [],
                commendations: Array.isArray(parsed.commendations) ? parsed.commendations : [],
                recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                totalAnalyzed: targetFeedbacks.length,
                sentimentOverview: localSummary,
              };
            }
          } else {
            const errText = await response.text();
            console.warn(`Gemini API returned ${response.status} for ${model}:`, errText);
          }
        } catch (err: any) {
          console.warn(`Error querying model ${model}:`, err?.message);
        }
      }
    } catch (err: any) {
      console.warn('Gemini synthesis loop failed:', err?.message);
    }
  }


  return {
    success: true,
    isAiGenerated: false,
    filterTopic,
    summaryText: `Analyzed ${targetFeedbacks.length} student submission${targetFeedbacks.length > 1 ? 's' : ''}${
      filterTopic !== 'all' ? ` for "${filterTopic}"` : ''
    }. Sentiment is ${
      localSummary.positivePct >= 50
        ? 'predominantly positive with student commendations'
        : localSummary.urgentPct >= 30
        ? 'focused on pressing student concerns requiring attention'
        : 'balanced with constructive ideas and student suggestions'
    }.`,
    keyIssues: localSummary.topTopics.slice(0, 3).map(
      (t) => `Discussion around ${t.topic} (${t.count} submission${t.count > 1 ? 's' : ''}, ${t.pct}%)`
    ),
    commendations: [
      `${localSummary.positivePct}% of messages share appreciation or praise.`,
      `${localSummary.suggestionPct}% propose helpful ideas for student life.`
    ],
    recommendations: [
      'Prioritize reviewing submissions marked as Urgent in the roster.',
      'Address recurring suggestions at the next ULES Executive Council meeting.'
    ],
    totalAnalyzed: targetFeedbacks.length,
    sentimentOverview: localSummary,
  };
}

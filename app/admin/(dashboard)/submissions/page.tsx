import prisma from '@/lib/prisma';
import SubmissionsClientTable from './SubmissionsClientTable';

export const revalidate = 0;

export default async function SubmissionsPage() {
  const rawFeedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch((err: any) => {
    console.error('Failed to load feedbacks:', err);
    return [];
  });


  const feedbacks = rawFeedbacks.map((fb: any) => ({
    id: fb.id,
    name: fb.name || null,
    email: fb.email || null,
    subject: fb.subject,
    message: fb.message,
    read: Boolean(fb.read),
    createdAt: fb.createdAt ? new Date(fb.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-6 font-['Neue_Machina']">
      <div>
        <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
          Student Feedback & Submissions
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review, analyze, and manage feedback submitted by engineering students.
        </p>
      </div>

      <SubmissionsClientTable feedbacks={feedbacks} />
    </div>
  );
}

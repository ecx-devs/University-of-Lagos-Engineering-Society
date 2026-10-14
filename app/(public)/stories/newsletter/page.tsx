import Link from 'next/link';
import { Construction, Newspaper, BookOpen, ArrowLeft } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PageBanner } from '@/components/section/PageBanner';

export const metadata = pageMetadata({
  title: 'ULES Newsletters',
  description:
    'The official newsletter archive and dispatch portal for the University of Lagos Engineering Society.',
  path: '/stories/newsletter',
  keywords: ['ULES newsletter', 'engineering newsletter', 'UNILAG engineering stories'],
});

export default function NewsletterPage() {
  return (
    <>
      <PageBanner
        title="ULES Newsletters"
        tagline="Dispatches and curated engineering highlights directly from Akoka"
      />

      <div className="min-h-[60vh] flex items-center justify-center font-['Neue_Machina'] px-4 py-16 md:py-24">
        <div className="w-full max-w-xl text-center space-y-6 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Accent top gradient bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-[#C85B15] to-transparent" />

          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="size-20 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#C85B15] shadow-xs">
                <Construction className="size-10" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Feature In Progress
          </div>

          {/* Headings */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
              Newsletter Under Construction
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              This publication channel is currently being prepared. Curated newsletter digests and dedicated subscription issues will be accessible here once the release schedule is finalized.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6" />

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/stories/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#170A51] text-white text-xs font-semibold hover:bg-[#22203E] transition-colors shadow-xs"
            >
              <BookOpen className="size-4 text-[#C85B15]" />
              Explore ULES Blog
            </Link>
            <Link
              href="/stories/news"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Newspaper className="size-4 text-[#106333]" />
              Latest News & Digest
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

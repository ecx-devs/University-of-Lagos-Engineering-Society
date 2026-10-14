export const BLOG_CATEGORIES = ['Tech', 'Career', 'Campus Life', 'Opinion'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPostItem = {
  id: string | number;
  slug: string;
  category: BlogCategory;
  details: {
    release: string;
    title: string;
    author: string;
    authorPfp?: string;
    authorBio?: string;
    date: string;
    longDate?: string;
    readTime?: string;
    description: string;
    body: string;
    readMoreHref?: string;
  };
  imageUrl: string;
  imageAlt: string;
  isPublished?: boolean;
};

export const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'post-1',
    slug: 'my-first-love-letter',
    category: 'Campus Life',
    details: {
      release: 'Release #01',
      title: 'My Last Love Letter 💌',
      author: 'ULES Editorial',
      authorPfp: '/logo/logo-transparent.png',
      authorBio: 'The official voice and stories from the University of Lagos Engineering Society.',
      date: 'November 2, 2025',
      longDate: 'November 2, 2025',
      readTime: '4 min read',
      description:
        'Most people think a love letter is about romance. Ours never was. A bittersweet reflection on late nights in Faculty rooms, forged bonds, and surviving engineering at UNILAG.',
      body: `Most people think a love letter is about romance. Mine never was.

This is a letter to the lecture theatres that saw our earliest mornings and the design studios that witnessed our quietest breakdowns. It is a letter to the drawing boards, the calculators passed around minutes before an exam, and the courtyards where we traded laughter between lectures.

## The Weight of the Journey
When you walk through the Faculty of Engineering gate for the first time as a freshman, you carry expectations heavier than your backpack. You hear legends of professors whose grading curves strike fear, and you wonder if you truly belong in these halls.

> "Engineering doesn't just teach you formulas; it tests your capacity to stay grounded when the calculations don't balance."

We quickly learned that the true curriculum was resilience. We formed study circles at 11 PM on WhatsApp, shared past questions at dawn, and celebrated the tiny victories—like finally understanding Laplace transforms or getting an Arduino circuit to breathe.

## What Remains
As semesters fly by, it is not the differential equations you remember most vividly. You remember the people. The coursemate who bought you cold water during a three-hour workshop, the lab partner who stayed behind to clean up the oscilloscopes, and the lecturers who believed in your potential when your code refused to compile.

This is not a goodbye to engineering; it is an ode to the brotherhood and sisterhood forged under its pressure.

To every engineer striving in Akoka today: keep your head high. You are building more than machines; you are building yourself.

-- ULES Editorial Board`,
      readMoreHref: '/stories/blog/my-first-love-letter',
    },
    imageUrl: '/blogs/my-first-love-letter.jpeg',
    imageAlt: 'My Last Love Letter 💌',
    isPublished: true,
  },
  {
    id: 'post-2',
    slug: 'engineering-the-future-ai-in-lagos',
    category: 'Tech',
    details: {
      release: 'Tech Focus',
      title: 'Engineering the Future: How UNILAG Students Are Building with AI',
      author: 'Babatunde Adeyemi',
      authorPfp: '/logo/logo-transparent.png',
      authorBio: 'Systems Engineering, 500L. AI Researcher and ULES Tech Committee Lead.',
      date: 'March 18, 2026',
      longDate: 'March 18, 2026',
      readTime: '5 min read',
      description:
        'From automated campus transit solutions to machine learning models for renewable microgrids, explore how UNILAG engineering undergraduates are building production-grade solutions.',
      body: `Artificial intelligence is no longer just a theoretical topic reserved for postgraduate symposiums. Across the 10 departments of the Faculty of Engineering at UNILAG, undergraduates are integrating machine learning into everyday Nigerian challenges.

## Bridging Theory with Local Reality
In our workshops this semester, one common theme emerged: African data problems require African engineering intuition. Standard models trained on Western infrastructure frequently stumble when confronted with erratic power grids, unique traffic patterns, or hyper-localized colloquial terms.

Here are three areas where student engineers are creating tangible impact:

* **Smart Grid Optimization:** Electrical engineering final-year projects that utilize lightweight neural networks to predict solar inverter battery degradation in off-grid campus setups.
* **Intelligent Transit Routing:** Systems engineering teams modeling campus shuttle traffic to minimize waiting times at the New Hall and Faculty bus stops.
* **Predictive Maintenance for Industrial Lathes:** Mechanical students using sound sensor telemetry and vibration frequency analysis to detect tool wear before catastrophic failure.

> "True innovation is not using the latest model architecture; it is solving a problem that your immediate community feels every morning."

## Getting Started in Applied AI
For younger students wondering where to start, the barrier to entry has never been lower. Start with clean Python fundamentals, grasp your linear algebra firmly, and join faculty student groups like the Google Developer Groups on campus and ULES Tech workshops.

The future of engineering in Lagos is being written in our labs. Pick up your keyboard and be part of it.`,
      readMoreHref: '/stories/blog/engineering-the-future-ai-in-lagos',
    },
    imageUrl: '/home/blog1.png',
    imageAlt: 'Engineering the Future: How UNILAG Students Are Building with AI',
    isPublished: true,
  },
  {
    id: 'post-3',
    slug: '5-tips-for-surviving-first-year-engineering',
    category: 'Career',
    details: {
      release: 'Guide #03',
      title: '5 Practical Tips for Thriving in Your First Year of Engineering',
      author: 'Chiamaka Okonkwo',
      authorPfp: '/logo/logo-transparent.png',
      authorBio: 'Mechanical Engineering Alumna & Shell Scholar. Mentor to junior engineering undergraduates.',
      date: 'April 15, 2026',
      longDate: 'April 15, 2026',
      readTime: '6 min read',
      description:
        'Starting your engineering journey at UNILAG can be intense. Here is the unvarnished playbook for mastering calculus, building stamina, and keeping your CGPA soaring.',
      body: `Every engineering alumnus remembers their Year One. The shock of MAT 111, the marathon physics practicals, and the sudden realization that secondary school study habits are completely insufficient.

Here are five tried-and-tested rules to not merely survive, but excel:

## 1. Respect the 70% Class Attendance Rule Early
Do not fall into the trap of skipping 8 AM lectures because slides might be shared later. The insights dropped off-hand by lecturers during whiteboard derivations are often the exact questions on the mid-semester tests.

## 2. Form a Complementary Study Circle
Never study alone all the time. Find three or four classmates whose strengths complement yours. If you are strong in Engineering Drawing, partner with someone who intuitively grasps Vector Analysis. Teaching others is also the fastest way to solidify your own mastery.

## 3. Master Your Time Blocking
University grants you sudden freedom. Without structure, days disappear into scrolling and aimless canteen visits.
* Dedicate at least 2 hours every evening to reviewing what was covered that day.
* Solve tutorial questions the very week they are assigned—never let backlogs accumulate.

## 4. Protect Your Health & Mental Wellbeing
An all-nighter before an exam might get you through a single test, but consistent sleep deprivation ruins analytical reasoning. Engineering exams require razor-sharp problem solving. Feed your body, drink clean water, and rest your eyes.

## 5. Get Involved Beyond the Classroom
Join ULES departmental committees, attend faculty hackathons, and play sports on weekends. The professional network and communication skills you develop in student leadership will matter just as much as your transcript when you graduate.

Stay disciplined, believe in your preparation, and welcome to the greatest faculty in the nation!`,
      readMoreHref: '/stories/blog/5-tips-for-surviving-first-year-engineering',
    },
    imageUrl: '/blogs/my-first-love-letter.jpeg',
    imageAlt: '5 Practical Tips for Thriving in Your First Year of Engineering',
    isPublished: true,
  },
  {
    id: 'post-4',
    slug: 'the-art-of-the-all-nighter',
    category: 'Opinion',
    details: {
      release: 'Opinion',
      title: 'The Art of the All-Nighter: Why Engineering Demands More Than Just Grit',
      author: 'Damilola Benson',
      authorPfp: '/logo/logo-transparent.png',
      authorBio: 'Civil & Environmental Engineering, 400L. Essayist and Debate Society Captain.',
      date: 'May 2, 2026',
      longDate: 'May 2, 2026',
      readTime: '4 min read',
      description:
        'We wear 3 AM design reviews and sleepless weeks like badges of honor, but sustainable brilliance comes from clarity, not caffeine alone. An honest critique of hustle culture in engineering.',
      body: `Walk through the 24-hour reading rooms or faculty foyers during test weeks, and you will see the same recurring scene: weary eyes fixed on laptop screens, empty energy drink cans, and students whispering formulas at 4:30 in the morning.

For decades, engineering culture has romanticized the "all-nighter" as the ultimate rite of passage. If you didn't sacrifice sleep, did you really work hard enough?

## The Fallacy of Diminishing Returns
The brain is an electrochemical machine governed by thermodynamics and biology. Cognitive studies repeatedly confirm that after 18 continuous hours of wakefulness, your analytical error rate spikes by over 40%. In engineering, where a misplaced negative sign or missed boundary condition collapses an entire structural analysis, sleep deprivation is counter-productive.

> "Working frantically until your eyes blur is not diligence; it is an emergency response to poor planning."

## A Call for Strategic Work
What if we shifted our collective admiration from *endurance* to *efficiency*?
1. Starting capstone designs 4 weeks earlier instead of 48 hours before submission.
2. Breaking complex technical problems into daily micro-tasks.
3. Embracing rest as an active design component that restores spatial reasoning and creative problem-solving.

Engineering is about creating sustainable, efficient systems for society. It is time we engineered our own daily lives with that exact same standard of care.`,
      readMoreHref: '/stories/blog/the-art-of-the-all-nighter',
    },
    imageUrl: '/home/blog1.png',
    imageAlt: 'The Art of the All-Nighter: Why Engineering Demands More Than Just Grit',
    isPublished: true,
  },
];

export const BLOG_ITEMS = INITIAL_BLOG_POSTS;
export const BLOG_POSTS = BLOG_ITEMS;
export const HIGHLIGHTED_POST_ITEMS = INITIAL_BLOG_POSTS.slice(0, 3);

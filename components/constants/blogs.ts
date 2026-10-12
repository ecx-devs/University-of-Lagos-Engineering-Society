export const HIGHLIGHTED_POST_ITEMS = [
  {
    id: 1,
    details: {
      release: 'Release #05',
      title: '5 Tips for Surviving Your First Year in Engineering',
      author: 'Chiamaka Okonkwo',
      date: 'Apr 15, 2026',
      description:
        'Starting your engineering journey can be overwhelming. Here are some practical tips to help you thrive academically and socially.',
      readMoreHref: '#',
    },
    imageUrl: '/home/blog1.png',
    imageAlt: 'Blog 1',
    highlight: true,
  },
  {
    id: 2,
    details: {
      release: 'Release #05',
      title: '5 Tips for Surviving Your First Year in Engineering',
      author: 'Chiamaka Okonkwo',
      date: 'Apr 15, 2026',
      description:
        'Starting your engineering journey can be overwhelming. Here are some practical tips to help you thrive academically and socially.',
      readMoreHref: '#',
    },
    imageUrl: '/home/blog1.png',
    imageAlt: 'Blog 2',
    highlight: true,
  },
  {
    id: 3,
    details: {
      release: 'Release #05',
      title: '5 Tips for Surviving Your First Year in Engineering',
      author: 'Chiamaka Okonkwo',
      date: 'Apr 15, 2026',
      description:
        'Starting your engineering journey can be overwhelming. Here are some practical tips to help you thrive academically and socially.',
      readMoreHref: '#',
    },
    imageUrl: '/home/blog1.png',
    imageAlt: 'Blog 3',
    highlight: true,
  },
];


export const BLOG_CATEGORIES = ['Tech', 'Career', 'Campus Life', 'Opinion'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];


export const BLOG_ITEMS: {
  id: number;
  slug: string;
  category: BlogCategory;
  details: {
    release: string;
    title: string;
    author: string;
    authorPfp: string;
    
    date: string;
    longDate: string;
    description: string;
    
    authorBio: string;
    
    body: string;
    readMoreHref: string;
  };
  
  blogLink: string;
  imageUrl: string;
  imageAlt: string;
}[] = [
  {
    id: 1,
    slug: "my-first-love-letter",
    category: 'Campus Life',
    details: {
      release: "Release #01",
      title: "My Last Love Letter 💌",
      author: "ULES Blog",
      authorPfp: "/blogs/ules-author.png",
      date: "November 2, 2025",
      longDate: "November 2, 2025",
      description:
        "Most people think a love letter is about romance.\nMine never was.\nThis is the last one. 💌\nhttps://ulesblog.substack.com/p/2358f364-d0fa-4194-9211-9b11501773ca\nYou probably think this is another newsletter.\nIt's a goodbye. 💛",
      authorBio: "ULES Blog is the official blog written and managed by the ULES.",


      body: "Most people think a love letter is about romance.\nMine never was.\nThis is the last one. 💌\nhttps://ulesblog.substack.com/p/2358f364-d0fa-4194-9211-9b11501773ca\nYou probably think this is another newsletter.\nIt's a goodbye. 💛",
      readMoreHref: '/stories/blog/my-first-love-letter',
    },
    blogLink: 'https://ulesblog.substack.com/p/2358f364-d0fa-4194-9211-9b11501773ca',
    imageUrl: "/blogs/my-first-love-letter.jpeg",
    imageAlt: "My Last Love Letter 💌",
  },
];

export const BLOG_POSTS = BLOG_ITEMS;

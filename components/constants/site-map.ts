import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    trigger: 'Home',
    href: '/',
  },
  {
    trigger: 'About Us',
    items: [
      { label: 'About ULES', href: '/about/ules' },
      { label: 'Leadership', href: '/about/leadership' },
      { label: 'FAQs', href: '/about/ules#faqs' },
    ],
  },
  {
    trigger: 'Activities',
    items: [
      { label: 'Events', href: '/activities/events' },
      { label: 'Gallery', href: '/activities/gallery' },
    ],
  },
  {
    trigger: 'Stories',
    items: [
      { label: 'ULES News', href: '/stories/news' },
      { label: 'Blog', href: '/stories/blog' },
      { label: 'Newsletters', href: '/stories/newsletter' },
    ],
  },
  {
    trigger: 'Spotlight',
    href: '/spotlight',
  },
  {
    trigger: 'Associations',
    items: [
      { label: 'All Associations', href: '/associations' },
      { label: 'Departmental Bodies', href: '/associations#departmental' },
      { label: 'Sub Bodies', href: '/associations#sub' },
    ],
  },
  {
    trigger: 'Student Aids',
    items: [
      { label: 'CGPA Calculator', href: 'https://gpai.com.ng' },
      { label: 'Feedback', href: '/student-aids/feedback' },
    ],
  },
];

export const QUICK_LINKS: NavItem[] = [
  { trigger: 'Home', href: '/' },
  { trigger: 'About Us', href: '/about/ules' },
  { trigger: 'EXCO', href: '/about/leadership' },
  { trigger: 'Associations', href: '/associations' },
];

export const RESOURCES: NavItem[] = [
  { trigger: 'CGPA Calculator', href: 'https://gpai.com.ng' },
  { trigger: 'Contact Us', href: '/contact' },
  { trigger: 'Feedback', href: '/student-aids/feedback' },
];

export const ACTIVITIES: NavItem[] = [
  { trigger: 'Gallery', href: '/activities/gallery' },
  { trigger: 'Events', href: '/activities/events' },
  { trigger: 'Blog', href: '/stories/blog' },
  { trigger: 'ULES News', href: '/stories/news' },
];

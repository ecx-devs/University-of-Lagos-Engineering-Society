import { PageTransition } from '@/components/motion/PageTransition';

/**
 * A `template`, not a `layout`: Next remounts templates on every navigation,
 * which is what makes the route enter animation replay. A layout persists, so
 * it would only ever run once on first load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

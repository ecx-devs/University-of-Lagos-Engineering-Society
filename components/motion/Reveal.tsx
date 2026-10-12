'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';

import { useAppReady } from '@/components/motion/app-ready';



const EASE = [0.16, 1, 0.3, 1] as const;


const VIEWPORT = { once: true, margin: '0px 0px -18% 0px' } as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE },
  },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ready = useAppReady();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      data-reveal
      className={className}
      variants={revealVariants}
      initial="hidden"


      whileInView={ready ? 'visible' : 'hidden'}
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}





const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};


export function Stagger({
  children,
  className,
  as: Tag = 'ul',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'ul' | 'div';
}) {
  const reduceMotion = useReducedMotion();
  const ready = useAppReady();
  if (reduceMotion) {
    return Tag === 'ul' ? (
      <ul className={className}>{children}</ul>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const Component = Tag === 'ul' ? motion.ul : motion.div;

  return (
    <Component
      data-reveal
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView={ready ? 'visible' : 'hidden'}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as: Tag = 'li',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'li' | 'div';
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return Tag === 'li' ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const Component = Tag === 'li' ? motion.li : motion.div;

  return (
    <Component data-reveal className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}

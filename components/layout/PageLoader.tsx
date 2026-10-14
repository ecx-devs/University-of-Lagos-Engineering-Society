'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { markAppBusy, markAppReady } from '@/components/motion/app-ready';




const MIN_MS = 1500;

const GRACE_MS = 160;

const MAX_MS = 6000;


function imagesSettled(): Promise<void> {
  const pending = Array.from(document.images).filter(
    (img) => !img.complete && img.loading !== 'lazy',
  );

  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {


          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}


function nextPaint(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

export function PageLoader() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const wasVisible = visible;
    let shownAt: number | null = wasVisible ? Date.now() : null;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;



    markAppBusy();
    if (wasVisible) setVisible(true);


    const graceTimer = wasVisible
      ? undefined
      : setTimeout(() => {
          if (cancelled) return;
          shownAt = Date.now();
          setVisible(true);
        }, GRACE_MS);

    const finish = () => {
      if (cancelled) return;
      clearTimeout(graceTimer);

      const heldFor = shownAt === null ? MIN_MS : Date.now() - shownAt;
      const remaining = Math.max(0, MIN_MS - heldFor);

      settleTimer = setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        markAppReady();
      }, remaining);
    };

    const waitForAssets = async () => {
      if (document.readyState !== 'complete') {
        await new Promise<void>((resolve) =>
          window.addEventListener('load', () => resolve(), { once: true }),
        );
      } else {
        await nextPaint();
      }

      await imagesSettled();


      if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
          await document.fonts.ready;
        } catch {

        }
      }
    };

    void waitForAssets().then(finish, finish);

    const maxTimer = setTimeout(() => {
      if (cancelled) return;
      setVisible(false);
      markAppReady();
    }, MAX_MS);

    return () => {
      cancelled = true;
      clearTimeout(graceTimer);
      clearTimeout(settleTimer);
      clearTimeout(maxTimer);
    };
  }, [pathname]);



  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-12 bg-background"
          initial={false}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-center justify-center">
            
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <Image
              src="/logo/logo-transparent.png"
              alt="ULES Logo"
              width={160}
              height={160}
              priority
              className="relative z-10 h-auto w-32 md:w-44"
            />
          </div>

          <div className="flex flex-col items-center gap-5">
            
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted md:w-64">
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                initial={{ x: '-200%' }}
                animate={reduceMotion ? { opacity: 1, x: 0 } : { x: ['-200%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            
            <span className="font-heading text-xs tracking-[0.3em] text-foreground/70 md:text-sm">
              INITIALIZING
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

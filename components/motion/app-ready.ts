'use client';

import { useSyncExternalStore } from 'react';



let appReady = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setAppReady(next: boolean) {
  if (appReady === next) return;
  appReady = next;
  emit();
}

export const markAppReady = () => setAppReady(true);
export const markAppBusy = () => setAppReady(false);



if (typeof window !== 'undefined') {
  setTimeout(markAppReady, 6500);
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

const getSnapshot = () => appReady;
const getServerSnapshot = () => false;

export function useAppReady() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

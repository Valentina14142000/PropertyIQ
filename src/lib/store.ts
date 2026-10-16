'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { mockProperties, type Property } from '@/lib/mock-data';

const KEY = 'propertyiq.properties.v1';
const EMPTY: Property[] = [];
const listeners = new Set<() => void>();
let cache: Property[] | null = null;

function valid(p: unknown): p is Property {
  const x = p as Property;
  return !!x && typeof x.id === 'string' && typeof x.address === 'string' && typeof x.price === 'number' && typeof x.estimatedRent === 'number';
}

function read(): Property[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? parsed.filter(valid) : mockProperties;
  } catch {
    cache = mockProperties;
  }
  return cache;
}

function write(next: Property[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep in memory for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

const noop = () => () => {};

export function useProperties() {
  const properties = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noop, () => true, () => false);

  const add = useCallback((p: Omit<Property, 'id'>) => {
    const id = `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    write([{ ...p, id }, ...read()]);
    return id;
  }, []);
  const remove = useCallback((id: string) => write(read().filter((p) => p.id !== id)), []);
  const reset = useCallback(() => write(mockProperties), []);

  return { properties, ready, add, remove, reset };
}

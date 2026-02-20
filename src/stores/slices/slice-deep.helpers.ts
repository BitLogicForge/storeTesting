import type { PayloadAction } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';

// Type helper for inferring the value type at a nested path
export type DeepGet<T, Path extends readonly string[]> = Path extends readonly []
  ? T
  : Path extends readonly [infer K extends string, ...infer Rest extends string[]]
    ? K extends keyof T
      ? DeepGet<T[K], Rest>
      : unknown
    : unknown;

// Creates a reducer that sets a value at an arbitrary nested path in the state
export function createGenericDeepValueSetter<K extends Record<string, unknown>>(scope: string) {
  return <Path extends readonly [string, ...string[]]>(path: Path, checkContent = false) =>
    (state: K, action: PayloadAction<DeepGet<K, Path>>) => {
      const value = action.payload;
      let current: Record<string, unknown> = state as unknown as Record<string, unknown>;

      for (let i = 0; i < path.length - 1; i++) {
        const segment = path[i];
        if (current[segment] === undefined || typeof current[segment] !== 'object' || current[segment] === null) {
          console.log(`[${scope}][path:${path.join('.')}] Segment '${segment}' not found`);
          return;
        }
        current = current[segment] as Record<string, unknown>;
      }

      const lastKey = path[path.length - 1];
      const currentValue = current[lastKey];

      if (checkContent && Array.isArray(currentValue) && Array.isArray(value)) {
        if (equal(currentValue, value)) {
          console.log(`[${scope}][path:${path.join('.')}] NO CHANGE`);
          return;
        }
      }

      if (currentValue !== value) {
        console.log(`[${scope}][path:${path.join('.')}] SET: `, value);
        current[lastKey] = value;
      }
    };
}

// Creates a reducer that sets a value at an arbitrary nested path within a keyed entry
// State = Record<string, Entry>
export function createNestedDeepValueSetter<Entry extends Record<string, unknown>>(scope: string, initialEntry: Entry) {
  return <Path extends readonly [string, ...string[]]>(path: Path, checkContent = false) =>
    (state: Record<string, Entry>, action: PayloadAction<{ key: string; value: DeepGet<Entry, Path> }>) => {
      const { key, value } = action.payload;

      // Auto-initialize entry if missing
      if (!state[key]) {
        console.log(`[${scope}][${key}] Initializing new entry`);
        state[key] = { ...initialEntry };
      }

      let current: Record<string, unknown> = state[key] as unknown as Record<string, unknown>;

      for (let i = 0; i < path.length - 1; i++) {
        const segment = path[i];
        if (current[segment] === undefined || typeof current[segment] !== 'object' || current[segment] === null) {
          console.log(`[${scope}][${key}][path:${path.join('.')}] Segment '${segment}' not found`);
          return;
        }
        current = current[segment] as Record<string, unknown>;
      }

      const lastKey = path[path.length - 1];
      const currentValue = current[lastKey];

      if (checkContent && Array.isArray(currentValue) && Array.isArray(value)) {
        if (equal(currentValue, value)) {
          console.log(`[${scope}][${key}][path:${path.join('.')}] NO CHANGE`);
          return;
        }
      }

      if (currentValue !== value) {
        console.log(`[${scope}][${key}][path:${path.join('.')}] SET: `, value);
        current[lastKey] = value;
      }
    };
}

// Factory function to create setters with state type already captured
export function createDeepSliceHelpers<K extends Record<string, unknown>>(scope: string) {
  return {
    createDeepValueSetter: <Path extends readonly [string, ...string[]]>(path: Path, checkContent = false) =>
      createGenericDeepValueSetter<K>(scope)(path, checkContent),

    createNestedDeepValueSetter: <Path extends readonly [string, ...string[]]>(path: Path, checkContent = false) =>
      createNestedDeepValueSetter<K>(scope, {} as K)(path, checkContent),
  };
}

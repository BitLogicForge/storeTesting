import type { PayloadAction } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';

// Helper functions for nested slice structures where State = Record<string, Entry>
// Each key in the state holds a complete entry object with auto-initialization support

// Helper to ensure entry exists, initializing if needed
function ensureEntry<Entry extends Record<string, unknown>>(
  state: Record<string, Entry>,
  key: string,
  initialEntry: Entry,
  scope: string,
): void {
  if (!state[key]) {
    console.log(`[${scope}][${key}] Initializing new entry`);
    state[key] = { ...initialEntry };
  }
}

// Generic function to create a value setter for a field in the nested entry
function createNestedValueSetter<Entry extends Record<string, unknown>, F extends keyof Entry>(
  field: F,
  scope: string,
  initialEntry: Entry,
  checkContent = false,
) {
  return (state: Record<string, Entry>, action: PayloadAction<{ key: string; value: Entry[F] }>) => {
    const { key, value } = action.payload;
    ensureEntry(state, key, initialEntry, scope);

    const currentValue = state[key][field];
    if (checkContent && Array.isArray(currentValue) && Array.isArray(value)) {
      if (equal(currentValue, value)) {
        console.log(`[${scope}][${key}][${String(field)}] NO CHANGE`);
        return;
      }
    }

    if (state[key][field] !== value) {
      console.log(`[${scope}][${key}][${String(field)}] SET: `, value);
      state[key][field] = value;
    }
  };
}

// Generic function to create a boolean toggler for a field in the nested entry
function createNestedBoolToggler<Entry extends Record<string, unknown>>(
  field: keyof Entry,
  scope: string,
  initialEntry: Entry,
) {
  return (state: Record<string, Entry>, action: PayloadAction<{ key: string }>) => {
    const { key } = action.payload;
    ensureEntry(state, key, initialEntry, scope);

    const newValue = !(state[key][field] as boolean);
    console.log(`[${scope}][${key}][${String(field)}] TOGGLE TO:`, newValue);
    state[key][field] = newValue as Entry[keyof Entry];
  };
}

// Function to create a value setter for dictionary fields within the nested entry
function createNestedValueSetterToDictionary<Entry extends Record<string, unknown>, F extends keyof Entry>(
  field: F,
  scope: string,
  initialEntry: Entry,
  checkContent = false,
) {
  type DictValue = Entry[F] extends Record<string, infer V> ? V : never;
  return (state: Record<string, Entry>, action: PayloadAction<{ key: string; dictKey: string; value: DictValue }>) => {
    const { key, dictKey, value } = action.payload;
    ensureEntry(state, key, initialEntry, scope);

    const dict = state[key][field] as Record<string, DictValue>;
    const currentValue = dict[dictKey];

    if (checkContent && Array.isArray(currentValue) && Array.isArray(value)) {
      if (equal(currentValue, value)) {
        console.log(`[${scope}][${key}][${String(field)}][K:${dictKey}] NO CHANGE`);
        return;
      }
    }

    if (dict[dictKey] !== value) {
      console.log(`[${scope}][${key}][${String(field)}][K:${dictKey}] SET: `, value);
      dict[dictKey] = value;
    }
  };
}

// Function to create a key remover for dictionary fields within the nested entry
function createNestedRemoveKeyFromDictionary<Entry extends Record<string, unknown>, F extends keyof Entry>(
  field: F,
  scope: string,
) {
  return (state: Record<string, Entry>, action: PayloadAction<{ key: string; dictKey: string }>) => {
    const { key, dictKey } = action.payload;

    // Skip if entry doesn't exist
    if (!state[key]) {
      console.log(`[${scope}][${key}] Entry not found`);
      return;
    }

    const dict = state[key][field] as Record<string, unknown>;
    if (dict[dictKey] !== undefined) {
      console.log(`[${scope}][${key}][${String(field)}][K:${dictKey}] REMOVE`);
      delete dict[dictKey];
    } else {
      console.log(`[${scope}][${key}][${String(field)}][K:${dictKey}] Key not found for removal`);
    }
  };
}

// Function to create an entry remover
function createNestedEntryRemover<Entry extends Record<string, unknown>>(scope: string) {
  return (state: Record<string, Entry>, action: PayloadAction<{ key: string }>) => {
    const { key } = action.payload;
    if (state[key]) {
      console.log(`[${scope}][${key}] Removing entry`);
      delete state[key];
    } else {
      console.log(`[${scope}][${key}] Entry not found for removal`);
    }
  };
}

// Factory function for nested slice structures where State = Record<string, Entry>
// Each key in the state holds a complete entry object
export function createNestedSliceHelpers<Entry extends Record<string, unknown>>(scope: string, initialEntry: Entry) {
  return {
    createValueSetter: <F extends keyof Entry>(field: F, checkContent = false) =>
      createNestedValueSetter<Entry, F>(field, scope, initialEntry, checkContent),
    createBoolToggler: (field: keyof Entry) => createNestedBoolToggler<Entry>(field, scope, initialEntry),
    createValueSetterToDict: <F extends keyof Entry>(field: F, checkContent = false) =>
      createNestedValueSetterToDictionary<Entry, F>(field, scope, initialEntry, checkContent),
    createRemoveKeyFromDict: <F extends keyof Entry>(field: F) =>
      createNestedRemoveKeyFromDictionary<Entry, F>(field, scope),
    createEntryRemover: () => createNestedEntryRemover<Entry>(scope),
  };
}

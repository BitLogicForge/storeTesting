import type { PayloadAction } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';

// Generic helper functions for creating reducers with logging and type safety

// Generic function to create a value setter for any field in the state
function createGenericValueSetter<K extends Record<string, unknown>, F extends keyof K>(
  field: F,
  scope: string,
  checkContent = false,
) {
  return (state: K, action: PayloadAction<K[F]>) => {
    const value = action.payload;
    if (checkContent && Array.isArray(state[field]) && Array.isArray(value)) {
      if (equal(state[field], value)) {
        console.log(`[${scope}][${String(field)}] NO CHANGE`);
        return;
      }
    }
    if (state[field] !== value) {
      console.log(`[${scope}][${String(field)}] SET: `, value);
      (state[field] as K[F]) = value;
    }
  };
}

function createGenericValueItemsSetter<K extends Record<string, unknown>, F extends keyof K>(field: F, scope: string) {
  return (state: K, action: PayloadAction<K[F]>) => {
    const value = action.payload;
    const currentValue = state[field] as unknown as Array<unknown>;

    if (Array.isArray(currentValue) && value) {
      if (currentValue.filter(item => item === value).length > 0) {
        console.log(`[${scope}][${String(field)}] REMOVE ITEM: ${value} FROM: `, [...currentValue]);
        (state[field] as unknown as Array<unknown>) = (currentValue as unknown as Array<unknown>).filter(
          item => item !== value,
        );
      } else {
        console.log(`[${scope}][${String(field)}] ADD ITEM: ${value} FROM: `, [...currentValue]);
        (state[field] as unknown as Array<unknown>).push(value);
      }
    }
  };
}

// Specialized function for setting values in a dictionary field
function createGenericValueSetterToDictionary<
  K extends Record<string, unknown>,
  F extends keyof K,
  V = K[F] extends Record<string, infer ValueType> ? ValueType : never,
>(field: F, scope: string, checkContent = false) {
  return (state: K, action: PayloadAction<{ dictKey: string; value: V }>) => {
    const { dictKey, value } = action.payload;
    const currentValue = (state[field] as Record<string, V>)[dictKey];
    if (checkContent && Array.isArray(currentValue) && Array.isArray(value)) {
      if (equal(currentValue, value)) {
        console.log(`[${scope}][${String(field)}][K:${dictKey}] NO CHANGE`);
        return;
      }
    }
    if ((state[field] as Record<string, V>)[dictKey] !== value) {
      console.log(`[${scope}][${String(field)}][K:${dictKey}] SET: `, value);
      (state[field] as Record<string, V>)[dictKey] = value;
    }
  };
}

// Function to create a reducer that removes a key from a dictionary field
function createRemoveKeyFromDictionary<K extends Record<string, unknown>, F extends keyof K>(field: F, scope: string) {
  return (state: K, action: PayloadAction<{ dictKey: string }>) => {
    const { dictKey } = action.payload;
    if ((state[field] as Record<string, unknown>)[dictKey] !== undefined) {
      console.log(`[${scope}][${String(field)}][K:${dictKey}] REMOVE`);
      delete (state[field] as Record<string, unknown>)[dictKey];
    } else {
      console.log(`[${scope}][${String(field)}][K:${dictKey}] Key not found for removal`);
    }
  };
}

// Generic function to create a boolean toggler for any boolean field in the state
function createGenericBoolToggler<K extends Record<string, unknown>>(field: keyof K, scope: string) {
  return (state: K) => {
    const newValue = !(state[field] as boolean);
    console.log(`[${scope}][${String(field)}] TOGGLE TO:`, newValue);
    (state as Record<keyof K, boolean>)[field] = newValue;
  };
}

function createGenericBoolTogglerToDictionary<K extends Record<string, unknown>, F extends keyof K>(
  field: F,
  scope: string,
) {
  return (state: K, action: PayloadAction<{ dictKey: string }>) => {
    const { dictKey } = action.payload;
    const currentValue = (state[field] as Record<string, boolean>)[dictKey] || false;
    const newValue = !currentValue;
    console.log(`[${scope}][${String(field)}][K:${dictKey}] TOGGLE TO:`, newValue);
    (state[field] as Record<string, boolean>)[dictKey] = newValue;
  };
}

// Factory function to create setters with state type already captured
export function createSliceHelpers<K extends Record<string, unknown>>(scope: string) {
  return {
    createValueSetter: <F extends keyof K>(field: F, checkContent = false) =>
      createGenericValueSetter<K, F>(field, scope, checkContent),
    createBoolToggler: (field: keyof K) => createGenericBoolToggler<K>(field, scope),
    createValueSetterToDict: <F extends keyof K>(field: F, checkContent = false) =>
      createGenericValueSetterToDictionary<K, F>(field, scope, checkContent),
    createRemoveKeyFromDict: <F extends keyof K>(field: F) => createRemoveKeyFromDictionary<K, F>(field, scope),
    createBoolTogglerToDict: <F extends keyof K>(field: F) => createGenericBoolTogglerToDictionary<K, F>(field, scope),
    createValueItemsSetter: <F extends keyof K>(field: F) => createGenericValueItemsSetter<K, F>(field, scope),
  };
}

//to refractor section - not used yet, but can be useful for more complex state structures like dictionaries of lists, etc.

export function ensureList<K extends Record<string, unknown>>(state: Record<string, K>, list: string, scope: string) {
  if (!state[list]) {
    state[list] = {} as K;
    console.log(`[${scope}][${String(list)}] Initialized list`);
  }
}

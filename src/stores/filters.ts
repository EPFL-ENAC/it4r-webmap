import { defineStore } from 'pinia';

export type FilterParams = {
  magnitudes: [number, number]
  tsunami: boolean | null
}

const DEFAULT_MAGNITUDES = { min: 1, max: 10 };

export const useFiltersStore = defineStore('filters', () => {

  const magnitudes = ref({...DEFAULT_MAGNITUDES});
  const tsunami = ref(null);

  function reset() {
    magnitudes.value = {...DEFAULT_MAGNITUDES};
    tsunami.value = null;
  }

  function asParams(): FilterParams {
    return {
      magnitudes: [magnitudes.value.min, magnitudes.value.max],
      tsunami: tsunami.value
    }
  }

  return {
    magnitudes,
    tsunami,
    reset,
    asParams,
  }

}, { persist: true });
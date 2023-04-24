import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigurationStore = defineStore('configuration', () => {
  const parametersUrl = ref<string>(import.meta.env.VITE_PARAMETERS_URL)
  const styleUrl = ref<string>(import.meta.env.VITE_STYLE_URL)
  return { parametersUrl, styleUrl }
})

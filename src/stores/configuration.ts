import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigurationStore = defineStore('configuration', () => {
  const envParametersUrl = import.meta.env.VITE_PARAMETERS_URL
  const envStyleUrl = import.meta.env.VITE_STYLE_URL

  const parametersUrl = ref<string>(
    envParametersUrl.startsWith('/')
      ? import.meta.env.BASE_URL + envParametersUrl
      : envParametersUrl
  )
  const styleUrl = ref<string>(
    envStyleUrl.startsWith('/') ? import.meta.env.BASE_URL + envStyleUrl : envStyleUrl
  )
  return { parametersUrl, styleUrl }
})

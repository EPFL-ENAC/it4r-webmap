import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTitleStore = defineStore('title', () => {
  const title = ref<string>()
  const subtitle = ref<string>()
  return { title, subtitle }
})

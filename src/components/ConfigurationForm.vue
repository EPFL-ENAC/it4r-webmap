<script setup lang="ts">
import { useConfigurationStore } from '@/stores/configuration.js'
import { storeToRefs } from 'pinia'

const rules = {
  required: (value: string) => !!value || 'Required.'
}
const { parametersUrl, styleUrl } = storeToRefs(useConfigurationStore())
</script>

<template>
  <v-form>
    <v-text-field
      v-model="parametersUrl"
      label="Parameters URL"
      :rules="[rules.required]"
      variant="outlined"
    />
    <v-text-field
      v-model="styleUrl"
      label="Style URL"
      :rules="[rules.required]"
      variant="outlined"
    />
  </v-form>
</template>

<script setup lang="ts">
import JsonWebMap from '@/components/JsonWebMap.vue'
import { useConfigurationStore } from '@/stores/configuration'

const { parametersUrl, styleUrl } = useConfigurationStore()
</script>

<template>
  <JsonWebMap :parameters-url="parametersUrl" :style-url="styleUrl" />
</template>

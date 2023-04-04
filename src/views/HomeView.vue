<script setup lang="ts">
import JsonWebMap from '@/components/JsonWebMap.vue'
</script>

<template>
  <JsonWebMap
    style-url="https://raw.githubusercontent.com/EPFL-ENAC/EIRA-data/main/Data_vector_style/style_raster_background.json"
    parameters-url="https://raw.githubusercontent.com/EPFL-ENAC/EIRA-data/feature/parameters/Data_vector_style/parameters.json"
  />
</template>

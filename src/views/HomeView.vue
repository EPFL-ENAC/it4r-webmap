<script setup lang="ts">
import LayerSelector, { type SelectableItem } from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import type { LngLatLike } from 'maplibre-gl'
import { ref } from 'vue'

const style =
  'https://raw.githubusercontent.com/EPFL-ENAC/EIRA-data/main/Data_vector_style/style_raster_background.json'
const center: LngLatLike = { lat: 18.0735, lng: -15.9582 }
const zoom = 12
const permanentLayerIds = ['background', 'natural_earth']
const popupLayerIds = ['piezometer_locations']
const items: SelectableItem[] = [
  {
    title: 'piezoLocations',
    ids: ['piezometer_locations', 'piezometer_locations_labels'],
    selected: true
  },
  {
    title: 'cityLimit',
    ids: ['approximate_development_limit'],
    selected: true
  },
  {
    title: 'dataExtent',
    ids: ['data_extent'],
    selected: true
  },
  {
    title: 'topography',
    ids: ['topo_clipped']
  },
  {
    title: 'test',
    ids: ['test_areas'],
    selected: true
  }
]

const selectedlayerIds = ref<string[]>([])
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="3">
        <LayerSelector v-model="selectedlayerIds" :items="items" />
      </v-col>
      <v-col cols="9">
        <MapLibreMap
          :center="center"
          :style-spec="style"
          :filter-ids="[...permanentLayerIds, ...selectedlayerIds]"
          :popup-layer-ids="popupLayerIds"
          :zoom="zoom"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

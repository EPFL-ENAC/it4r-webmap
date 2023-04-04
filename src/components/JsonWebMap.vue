<script setup lang="ts">
import LayerSelector, { type SelectableItem } from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import axios from 'axios'
import type { LngLatLike } from 'maplibre-gl'
import { ref, shallowRef, triggerRef, watch } from 'vue'

interface Parameters {
  center?: LngLatLike
  zoom?: number
  permanentLayerIds?: string[]
  popupLayerIds?: string[]
  selectableItems?: SelectableItem[]
}

const props = defineProps<{
  styleUrl: string
  parametersUrl: string
}>()

const parameters = shallowRef<Parameters>({})

watch(
  () => props.parametersUrl,
  (parametersUrl) => {
    axios
      .get<Parameters>(parametersUrl)
      .then((response) => response.data)
      .then((data) => {
        parameters.value = data
        triggerRef(parameters)
        map.value?.update(data.center, data.zoom)
      })
  },
  { immediate: true }
)

const map = ref<InstanceType<typeof MapLibreMap>>()
const selectedlayerIds = ref<string[]>([])
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="3">
        <v-row>
          <v-col>
            <LayerSelector v-model="selectedlayerIds" :items="parameters.selectableItems" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card title="Legends"></v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="9">
        <MapLibreMap
          ref="map"
          :center="parameters.center"
          :style-spec="styleUrl"
          :filter-ids="[...(parameters.permanentLayerIds ?? []), ...selectedlayerIds]"
          :popup-layer-ids="parameters.popupLayerIds"
          :zoom="parameters.zoom"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

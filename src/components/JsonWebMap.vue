<script setup lang="ts">
import LayerSelector from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import type { Parameters } from '@/utils/jsonWebMap'
import type { SelectableSingleItem } from '@/utils/layerSelector'
import axios from 'axios'
import { computed, ref, shallowRef, triggerRef, watch } from 'vue'

const props = defineProps<{
  styleUrl: string
  parametersUrl: string
}>()

const map = ref<InstanceType<typeof MapLibreMap>>()
const selectedLayerIds = ref<string[]>([])
const parameters = shallowRef<Parameters>({})

const singleItems = computed<SelectableSingleItem[]>(() =>
  (parameters.value.selectableItems ?? []).flatMap((item) =>
    'children' in item ? item.children : [item]
  )
)
const selectableLayerIds = computed<string[]>(() => singleItems.value.flatMap((item) => item.ids))
const legendItems = computed(() =>
  singleItems.value
    .filter((item) => selectedLayerIds.value.some((id) => item.ids.includes(id)))
    .flatMap((item) =>
      item.legend !== undefined
        ? [
            {
              label: item.label,
              legend: item.legend
            }
          ]
        : []
    )
)

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
</script>

<template>
  <v-container class="fill-height pa-0" fluid>
    <v-row class="fill-height">
      <v-col cols="12" md="3" sm="6" class="pl-6">
        <v-row>
          <v-col>
            <LayerSelector v-model="selectedLayerIds" :items="parameters.selectableItems" />
          </v-col>
        </v-row>
        <v-divider class="border-opacity-100 mx-n3" />
        <v-row>
          <v-col>
            <v-card title="Legends" flat>
              <v-card-text>
                <v-row>
                  <v-col v-for="(item, index) in legendItems" :key="index" cols="12">
                    <h3>{{ item.label }}</h3>
                    <div>{{ item.legend }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="border-opacity-100" vertical />
      <v-col cols="12" md="9" sm="6" class="py-0 pl-0">
        <MapLibreMap
          ref="map"
          :center="parameters.center"
          :style-spec="styleUrl"
          :selectable-layer-ids="selectableLayerIds"
          :selected-layer-ids="selectedLayerIds"
          :popup-layer-ids="parameters.popupLayerIds"
          :zoom="parameters.zoom"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

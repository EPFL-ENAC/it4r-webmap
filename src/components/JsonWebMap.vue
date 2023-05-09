<script setup lang="ts">
import ConfigurationForm from '@/components/ConfigurationForm.vue'
import LayerSelector from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import { useTitleStore } from '@/stores/title'
import type { Parameters } from '@/utils/jsonWebMap'
import type { SelectableSingleItem } from '@/utils/layerSelector'
import { mdiChevronLeft, mdiChevronRight, mdiCog, mdiLayers, mdiMapLegend } from '@mdi/js'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { computed, ref, shallowRef, triggerRef, watch } from 'vue'

const props = defineProps<{
  styleUrl: string
  parametersUrl: string
}>()

const map = ref<InstanceType<typeof MapLibreMap>>()
const selectedLayerIds = ref<string[]>([])
const parameters = shallowRef<Parameters>({})
const drawerRail = ref(false)

const { title, subtitle } = storeToRefs(useTitleStore())

const singleItems = computed<SelectableSingleItem[]>(() =>
  (parameters.value.selectableItems ?? []).flatMap((item) =>
    'children' in item ? item.children : [item]
  )
)
const selectableLayerIds = computed<string[]>(() => singleItems.value.flatMap((item) => item.ids))
const legendItems = computed(() =>
  singleItems.value
    .filter((item) => selectedLayerIds.value.some((id) => item.ids.includes(id)))
    .filter((item) => item.legend !== undefined || item.legendImage !== undefined)
    .map((item) => ({
      label: item.label,
      legend: item.legend,
      legendImage: item.legendImage
    }))
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
        title.value = data.title
        subtitle.value = data.subtitle
      })
  },
  { immediate: true }
)
</script>

<template>
  <v-navigation-drawer :rail="drawerRail" @click="drawerRail = false">
    <v-list density="compact" nav>
      <v-list-item :prepend-icon="drawerRail ? mdiChevronRight : undefined">
        <template #append>
          <v-btn :icon="mdiChevronLeft" variant="flat" @click.stop="drawerRail = true" />
        </template>
      </v-list-item>
      <v-list-item :prepend-icon="mdiLayers">
        <LayerSelector
          v-if="!drawerRail"
          v-model="selectedLayerIds"
          :items="parameters.selectableItems"
        />
      </v-list-item>
      <v-list-item :prepend-icon="mdiMapLegend">
        <v-card v-if="!drawerRail" title="Legends" flat>
          <v-card-text>
            <v-row>
              <v-col v-for="(item, index) in legendItems" :key="index" cols="12">
                <h3>{{ item.label }}</h3>
                <div v-if="item.legend">{{ item.legend }}</div>
                <v-img v-if="item.legendImage" :src="item.legendImage" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-list-item>
      <v-divider class="border-opacity-100 mx-n3" />
      <v-dialog>
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template #activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="mdiCog" title="Configuration" />
        </template>
        <v-card title="Configuration">
          <v-card-text>
            <ConfigurationForm />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-list>
  </v-navigation-drawer>
  <v-container class="fill-height pa-0" fluid>
    <v-row class="fill-height">
      <v-col cols="12" class="py-0">
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

<style lang="scss">
.v-navigation-drawer {
  border-right: 1px solid rgb(var(--v-theme-primary)) !important;
}
</style>

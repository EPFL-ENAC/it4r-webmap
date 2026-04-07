<template>
  <q-page class="map-page">
    <maplibre-map position geocoder :zoom="2" @map:loaded="onMapLoaded" @map:click="onMapClick" />
  </q-page>
</template>

<style scoped>
.map-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">
import MaplibreMap from 'components/MaplibreMap.vue';
import type { Map, MapMouseEvent } from 'maplibre-gl';

const mapStore = useMapStore();
const filtersStore = useFiltersStore();

async function onMapLoaded(map: Map) {
  await mapStore.initLayers(map).then(() => {
    mapStore.applyFilters(filtersStore.asParams());
  });
}

function onMapClick(event: MapMouseEvent) {
  console.log('Map clicked at:', event.lngLat);
  // custom popup
  // new Popup()
  //   .setLngLat(event.lngLat)
  //   .setHTML('<b>Hello World!</b>')
  //   .addTo(map as Map);
}
</script>

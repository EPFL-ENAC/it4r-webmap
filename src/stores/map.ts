import { defineStore } from 'pinia';
import { appendEarthquakesLayers, toggleEarthquakesLayers, filterEarthquakes } from 'src/utils/layers';
import { Map } from 'maplibre-gl';

export type LayerSelection = {
  id: string;
  visible: boolean;
}

export type FilterParams = {
  magnitudes: [number, number]
  tsunami: boolean | null
}

export const useMapStore = defineStore('map', () => {

  const map = ref<Map>();

  const layers: LayerSelection[] = [
    { id: 'earthquakes', visible: true },
  ];

  function findLayer(id: string) {
    return layers.find((l) => l.id === id);
  }

  function toggleLayer(id: string) {
    if (!map.value) return;
    const layer = findLayer(id)
    if (layer) {
      if (id === 'earthquakes') {
        toggleEarthquakesLayers(map.value, layer.visible);
      }
    }
  }

  function applyFilters(filters: FilterParams) {
    if (!map.value) return;
    if (findLayer('earthquakes')?.visible)
      filterEarthquakes(map.value, filters.magnitudes, filters.tsunami);
  }

  function initLayers(mapInstance: Map) {
    map.value = mapInstance;
    layers.forEach((layer) => {
      if (layer.id === 'earthquakes') {
        appendEarthquakesLayers(mapInstance);
      }
    });
  }

  return {
    map,
    layers,
    applyFilters,
    toggleLayer,
    initLayers,
  };

});
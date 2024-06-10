import { defineStore } from 'pinia';
import { appendEarthquakesLayers, toggleEarthquakesLayers, filterEarthquakes } from 'src/utils/layers';
import { Map } from 'maplibre-gl';
import { FilterParams } from 'src/stores/filters';

export type LayerSelection = {
  id: string;
  visible: boolean;
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

  async function initLayers(mapInstance: Map) {
    map.value = mapInstance;
    return Promise.all(
      layers.map((layer) => {
        if (layer.id === 'earthquakes') {
          return appendEarthquakesLayers(mapInstance);
        }
        return Promise.resolve();
      })
    );
  }

  return {
    map,
    layers,
    applyFilters,
    toggleLayer,
    initLayers,
  };

});
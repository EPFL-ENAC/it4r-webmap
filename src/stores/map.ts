import { defineStore } from 'pinia';
import { appendEarthquakesLayers, removeEarthquakesLayers } from 'src/utils/layers';
import { Map } from 'maplibre-gl';

export type LayerSelection = {
  id: string;
  selected: boolean;
}

export const useMapStore = defineStore('map', () => {

  const map = ref<Map>();

  const layers: LayerSelection[] = [
    { id: 'earthquakes', selected: true },
    { id: 'other', selected: true },
  ];

  function toggleLayer(id: string) {
    const layer = layers.find((l) => l.id === id)
    if (layer) {
      if (id === 'earthquakes') {
        if (layer.selected) {
          appendEarthquakesLayers(map.value);
        } else if (id === 'earthquakes') {
          removeEarthquakesLayers(map.value);
        } 
      }
    }
  }

  function initLayers(mapInstance: Map) {
    map.value = mapInstance;
    if (layers.find((l) => l.id === 'earthquakes')?.selected) {
      appendEarthquakesLayers(map.value);
    }
  }

  return {
    map,
    layers,
    toggleLayer,
    initLayers,
  };

});
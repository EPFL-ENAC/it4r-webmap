import { defineStore } from 'pinia';
import { appendEarthquakesLayers, toggleEarthquakesLayers } from 'src/utils/layers';
import { Map } from 'maplibre-gl';

export type LayerSelection = {
  id: string;
  visible: boolean;
}

export const useMapStore = defineStore('map', () => {

  const map = ref<Map>();

  const layers: LayerSelection[] = [
    { id: 'earthquakes', visible: true },
  ];

  function toggleLayer(id: string) {
    if (!map.value) return;
    const layer = layers.find((l) => l.id === id)
    if (layer) {
      if (id === 'earthquakes') {
        toggleEarthquakesLayers(map.value, layer.visible);
      }
    }
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
    toggleLayer,
    initLayers,
  };

});
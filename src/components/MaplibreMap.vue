<template>
  <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
    <q-spinner-dots color="primary" size="100px" />
  </div>
  <div id="maplibre-map"></div>
</template>

<style scoped>
#maplibre-map {
  height: 95vh;
  width: 100vw;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'MaplibreMap',
});
</script>
<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibregl-theme-switcher/styles.css'
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import { ThemeSwitcherControl, ThemeDefinition } from 'maplibregl-theme-switcher'
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  MapMouseEvent,
  Marker,
  NavigationControl,
  ScaleControl,
  type LngLatLike,
  type StyleSpecification
} from 'maplibre-gl';
import { DivControl } from 'src/utils/control'
import { geocoderApi } from 'src/utils/geocoder'

interface Props {
  styleSpec: string | StyleSpecification | undefined
  center: LngLatLike;
  zoom?: number
  minZoom?: number
  maxZoom?: number
  themes?: ThemeDefinition[]
  themeDefault?: string
  position?: boolean | string | undefined
  geocoder?: boolean | string | undefined
  attribution?: string
}
const props = withDefaults(defineProps<Props>(), {
  styleSpec: 'style.json',
  center: [6.566547557495834, 46.521590682027536] as LngLatLike,
  zoom: 12,
  aspectRatio: undefined,
  minZoom: 0,
  maxZoom: undefined,
  themes: undefined,
  themeDefault: undefined,
  position: false,
  geocoder: false
});

const emit = defineEmits(['map:loaded', 'map:click'])

const { locale } = useI18n({ useScope: 'global' });
const DEFAULT_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://www.epfl.ch/" target="_blank">EPFL</a>';

const loading = ref(true);

let map: Map | undefined = undefined;

onMounted(() => {
  map = new Map({
    container: 'maplibre-map',
    style: props.styleSpec || 'style.json',
    center: props.center,
    zoom: props.zoom,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    attributionControl: false,
  });

  map.addControl(new NavigationControl());
  map.addControl(new GeolocateControl({}))
  map.addControl(new ScaleControl());
  map.addControl(new FullscreenControl());
  map.addControl(new ThemeSwitcherControl(props.themes, props.themeDefault));


  map.addControl(new AttributionControl({
      compact: true,
      customAttribution: props.attribution || DEFAULT_ATTRIBUTION 
  }));

  if (props.geocoder === true || props.geocoder === 'true') {
    map.addControl(
      new MaplibreGeocoder(geocoderApi, {
        maplibregl: { Marker },
        showResultsWhileTyping: true,
        language: locale.value
      }),
      'top-left'
    )
  }

  map.on('click', (event: MapMouseEvent) => {
    emit('map:click', event, map as Map);
  });

  if (props.position === true || props.position === 'true') {   
    const positionControl = new DivControl({ id: 'map-position' })
    map.addControl(positionControl, 'bottom-left')
    map.on('mousemove', function (event: MapMouseEvent) {
      if (positionControl.container) {
        positionControl.container.innerHTML = `Lat/Lon: (${event.lngLat.lat.toFixed(4)}; ${event.lngLat.lng.toFixed(4)})`
      }
    })
    map.on('mouseout', function () {
      if (positionControl.container) {
        positionControl.container.innerHTML = ''
      }
    })
  }

  map.once('load', () => {
    emit('map:loaded', map as Map);
    loading.value = false
  })
});

</script>
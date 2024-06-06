import { Feature, FeatureCollection } from 'geojson';

// restrict by country code and/or view box
const countryCode = undefined //'ch'
const viewBox = undefined // '5.80,46.40,6.25,46.10'

function handleNominatimResponse(geojson: FeatureCollection): Feature[] {
  const features = []
  const place_names: string[] = []
  for (const feature of geojson.features.filter((f: Feature) => countryCode === undefined || f.properties?.address.country_code === countryCode)) {
    if (feature.properties && feature.bbox && !place_names.includes(feature.properties.display_name)) {
      const center = [
        feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
        feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
      ]
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center,
        },
        place_name: feature.properties.display_name,
        properties: feature.properties,
        text: feature.properties.display_name,
        place_type: ['place'],
        center,
      } as Feature;
      place_names.push(feature.properties.display_name)
      features.push(point)
    }
  }
  return features;
}

let searchController: AbortController
let reverseController: AbortController

/**
 * Example: https://maplibre.org/maplibre-gl-js-docs/example/geocoder/
 * API: https://github.com/maplibre/maplibre-gl-geocoder/blob/main/API.md
 * Output format: https://web.archive.org/web/20210224184722/https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 */
export const geocoderApi = {
  forwardGeocode: async (config: { query: string; limit: number; countries: string[] }) => {
    let features: Feature[] = []
    try {
      let countrycodes: string | undefined = countryCode
      if (config.countries && config.countries.length > 0)
        countrycodes = config.countries.join(',')
      let request = `https://nominatim.openstreetmap.org/search?q=${config.query}&limit=${config.limit}&format=geojson&polygon_geojson=1&addressdetails=1&bounded=1`;
      if (countrycodes) {
        request = `${request}&countrycodes=${countrycodes}`
      }
      if (viewBox) {
        request = `${request}&viewbox=${viewBox}`
      }
      if (searchController)
        searchController.abort()
      searchController = new AbortController()
      const response = await fetch(request, { signal: searchController.signal })
      const geojson = await response.json()
      features = handleNominatimResponse(geojson)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      if (e.name !== 'AbortError')
        console.error(`Failed to forwardGeocode with error: ${e}`)
    }
    return {
      features,
    }
  },
  reverseGeocode: async (config: { query: { lat: number, long: number} }) => {
    let features: Feature[] = []
    try {
      if (reverseController)
        reverseController.abort()
      reverseController = new AbortController()
      const request = `https://nominatim.openstreetmap.org/reverse?lat=${config.query.lat}&lon=${config.query.lon}&format=geojson&polygon_geojson=1&addressdetails=1`
      const response = await fetch(request, { signal: reverseController.signal })
      const geojson = await response.json()
      features = handleNominatimResponse(geojson)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      if (e.name !== 'AbortError')
        console.error(`Failed to reverseGeocode with error: ${e}`)
    }
    return {
      features,
    }
  },
}

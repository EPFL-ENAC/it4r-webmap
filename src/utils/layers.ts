import { Map, Popup } from 'maplibre-gl';

export function appendEarthquakesLayers(map: Map) {
  map.addSource('earthquakes', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: 'https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: 'earthquakes-clusters',
    type: 'circle',
    source: 'earthquakes',
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: 'earthquakes-cluster-count',
    type: 'symbol',
    source: 'earthquakes',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Roboto Regular'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'earthquakes-unclustered-point',
    type: 'circle',
    source: 'earthquakes',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // inspect a cluster on click
  map.on('click', 'earthquakes-clusters', async (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['earthquakes-clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    const zoom = await map.getSource('earthquakes').getClusterExpansionZoom(clusterId);
    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom
    });
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on('click', 'earthquakes-unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const mag = e.features[0].properties.mag;
    let tsunami;

    if (e.features[0].properties.tsunami === 1) {
      tsunami = 'yes';
    } else {
      tsunami = 'no';
    }

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new Popup()
      .setLngLat(coordinates)
      .setHTML(
        `Magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
      )
      .addTo(map);
  });

  map.on('mouseenter', 'earthquakes-clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'earthquakes-clusters', () => {
      map.getCanvas().style.cursor = '';
  });
}

export function removeEarthquakesLayers(map: Map) {
  map.removeLayer('earthquakes-clusters');
  map.removeLayer('earthquakes-cluster-count');
  map.removeLayer('earthquakes-unclustered-point');
  map.removeSource('earthquakes');
}
<script>
    import { onMount } from 'svelte';
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
  
    let mapElement;
  
    onMount(() => {
      new Map({
        target: mapElement,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0], // Center of the map [longitude, latitude]
          zoom: 2, // Initial zoom level
        }),
      });
    });
  </script>
  
  <style>
    .map {
      height: 400px; /* Specify a height for the map */
      width: 100%; /* Full width */
    }
  </style>
  
  <div bind:this={mapElement} class="map"></div>
  
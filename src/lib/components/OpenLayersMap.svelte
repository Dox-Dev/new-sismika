<script lang="ts">
  import { onMount } from 'svelte';
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';

  // This is used to convert from [longitude, latitude]
  // to a coordinate system OpenLayers can read.
  // https://stackoverflow.com/questions/27820784/openlayers-3-center-map
  import { fromLonLat } from 'ol/proj';

  // This is used to check the current theme mode of the webpage.
  import { modeCurrent } from '@skeletonlabs/skeleton';

  // This is used for the markers in the OpenStreetMap.
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import VectorSource from 'ol/source/Vector';
  import {Icon, Style} from 'ol/style';
  import VectorLayer from 'ol/layer/Vector';

  // Initialize the tilesets, map, and mount.
  // Note that the tile_server will have change
  // dynamically depending on the current theme/mode.
  const tile_server = new OSM(); // tilemap
  let mapElement: HTMLElement;
  let mountedMap: Map;
  onMount(() => {
    mountedMap = new Map({
      target: mapElement,
      layers: [
        new TileLayer({
          // tile_server is where the links to the themes will be placed
          // https://github.com/CartoDB/basemap-styles
          source: tile_server,
        }),
      ],
      view: new View({
        center: fromLonLat([121.0685, 14.6539]), // Center of the map [longitude, latitude]
        zoom: 5, // Initial zoom level
      }),
    });

    // Your JSON data
    var data = [
      {longitude: 0, latitude:0},
      {longitude: 121.0685, latitude: 14.6539},
    ];
    
    var vectorSource = new VectorSource();
    
    // Iterate over the data to create and add each marker
    data.forEach(function(item) {
      console.log(item.longitude, item.latitude)
      // Create a feature for the marker
      var marker = new Feature({
        geometry: new Point(
          fromLonLat([item.longitude, item.latitude]) // Marker position
        )
      });

      let icon = new Icon({
          width: 20,
          height: 20,
          //src: 'https://static-00.iconduck.com/assets.00/map-pin-marker-icon-1490x2048-dim0ohl8.png',
          src: '/map-pin.png',
      });
      
      // Create a style for the marker
      var iconStyle = new Style({
        image: icon,
      });

      //var styles = [new Style({
      //  image: icon,
      //})];

      // Apply the style to the marker
      marker.setStyle(iconStyle);

      // Add the marker to the vector source
      vectorSource.addFeature(marker);

      function scaleFunction(resolution: number) {
        // This is just an example. You might need to adjust the numbers
        // to get the desired effect for your specific use case.
        var maxResolution = 156543.0339; // max resolution for EPSG:3857
        var minScale = 0.1; // the minimum scale
        var maxScale = 1.0; // the maximum scale
        
        var scale = minScale + (maxResolution - resolution) / maxResolution * (maxScale - minScale);
        return scale;
      }

      // Add the vector source to a layer and add it to the map
      var markerLayer = new VectorLayer({
        source: vectorSource,
        style: function(feature, resolution) {
          var zoom = mountedMap.getView().getZoomForResolution(resolution);
          var iconSize = zoom; // Aajust this calc as needed
          return new Style({
            image: new Icon({
              //src: 'https://static-00.iconduck.com/assets.00/map-pin-marker-icon-1490x2048-dim0ohl8.png',
              src: '/favicon.png',
              scale: iconSize,//iconSize,
            })
          });
        }
        //style: function(feature, resolution) {
        //  var scale = scaleFunction(resolution);
        //  icon.setScale(scale);
        //  return iconStyle;
        //},
      });

      mountedMap.addLayer(markerLayer);

      mountedMap.getView().on('change:resolution', function() {
        markerLayer.changed();  // This will force a redraw of the layer
      });
    });
  }); 
  
  

  // Dynamically change the themeURL and tile_server link.
  let themeURL: string;
  $: themeURL = ($modeCurrent)?
  'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png':
  'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  $: tile_server.setUrl(themeURL);
</script>
  
<style>
  .map {
    height: 400px; /* Specify a height for the map */
    width: 100%; /* Full width */
  }
</style>

<div bind:this={mapElement} class="map"></div>
  
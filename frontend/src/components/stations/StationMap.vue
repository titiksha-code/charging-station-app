<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import type { ChargingStation } from '@/types'
import 'leaflet/dist/leaflet.css'

interface Props {
  stations: ChargingStation[]
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [20.5937, 78.9629],
  zoom: 12,
})

const emit = defineEmits<{
  'station-click': [station: ChargingStation]
}>()

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null

// Fix Leaflet icon issue
const iconDefault = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: string
}
delete iconDefault._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const createMarkerIcon = (status: string) => {
  const color = status === 'Active' ? '#10b981' : '#ef4444'

  return L.divIcon({
    html: `
      <div style="position: relative;">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
          <circle cx="15" cy="15" r="8" fill="white"/>
          <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="${color}">⚡</text>
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  })
}

const addMarkers = () => {
  if (!map || !markersLayer) return

  // Clear existing markers
  markersLayer.clearLayers()

  // Add new markers
  props.stations.forEach((station) => {
    const marker = L.marker([station.location.latitude, station.location.longitude], {
      icon: createMarkerIcon(station.status),
    })

    // Create popup content
    const popupContent = `
      <div class="station-popup">
        <h3>${station.name}</h3>
        <p><strong>Status:</strong> <span class="${station.status.toLowerCase()}">${station.status}</span></p>
        <p><strong>Power:</strong> ${station.powerOutput} kW</p>
        <p><strong>Connector:</strong> ${station.connectorType}</p>
        <button class="view-details-btn" data-station-id="${station._id}">View Details</button>
      </div>
    `

    marker.bindPopup(popupContent)

    marker.on('popupopen', () => {
      // Add click handler for the button after popup opens
      setTimeout(() => {
        const btn = document.querySelector(`[data-station-id="${station._id}"]`)
        if (btn) {
          btn.addEventListener('click', () => {
            emit('station-click', station)
          })
        }
      }, 0)
    })

    markersLayer!.addLayer(marker)
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map
  map = L.map(mapContainer.value).setView(props.center, props.zoom)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // Create markers layer
  markersLayer = L.layerGroup().addTo(map)

  // Add markers
  addMarkers()
})

// Watch for station changes
watch(
  () => props.stations,
  () => {
    addMarkers()
  },
  { deep: true },
)
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
  position: relative;
}

#map {
  height: 100%;
  width: 100%;
}

:global(.station-popup) {
  min-width: 200px;
}

:global(.station-popup h3) {
  margin: 0 0 10px 0;
  color: #1f2937;
}

:global(.station-popup p) {
  margin: 5px 0;
  font-size: 14px;
}

:global(.station-popup .active) {
  color: #10b981;
  font-weight: 500;
}

:global(.station-popup .inactive) {
  color: #ef4444;
  font-weight: 500;
}

:global(.view-details-btn) {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

:global(.view-details-btn:hover) {
  background: #1d4ed8;
}

:global(.custom-marker) {
  background: none;
  border: none;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}
</style>

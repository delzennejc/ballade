import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import type { CountryMarkerData } from "./MapModal"

// Fix for default marker icon in Next.js/Webpack
// Create custom marker icons
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapViewProps {
  countryMarkers: CountryMarkerData[]
  selectedCountry: string | null
  onCountrySelect: (country: string) => void
}

// Component to handle map view adjustments
function MapController({
  selectedCountry,
  countryMarkers,
}: {
  selectedCountry: string | null
  countryMarkers: CountryMarkerData[]
}) {
  const map = useMap()
  const prevSelectedRef = useRef<string | null>(null)

  useEffect(() => {
    if (selectedCountry && selectedCountry !== prevSelectedRef.current) {
      const marker = countryMarkers.find((m) => m.country === selectedCountry)
      if (marker) {
        map.flyTo(marker.coordinates, 5, { duration: 0.5 })
      }
    }
    prevSelectedRef.current = selectedCountry
  }, [selectedCountry, countryMarkers, map])

  return null
}

export default function MapView({
  countryMarkers,
  selectedCountry,
  onCountrySelect,
}: MapViewProps) {
  return (
    <MapContainer
      center={[48, 10]}
      zoom={4}
      minZoom={2}
      maxZoom={10}
      className="w-full h-full"
      style={{ background: "#e5e7eb" }}
      scrollWheelZoom={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        selectedCountry={selectedCountry}
        countryMarkers={countryMarkers}
      />

      {countryMarkers.map((marker) => {
        const isSelected = marker.country === selectedCountry

        return (
          <Marker
            key={marker.country}
            position={marker.coordinates}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onCountrySelect(marker.country),
            }}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-gray-800">{marker.country}</strong>
                <br />
                <span className="text-gray-600">
                  {marker.songCount} chanson{marker.songCount > 1 ? "s" : ""}
                </span>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

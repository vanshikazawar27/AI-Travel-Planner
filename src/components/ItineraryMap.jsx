import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import React from "react";
import L from "leaflet";


// Fix default marker icon path issues with bundlers
const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ItineraryMap({
  locations = [],
  center,
  height = 420,
  polyline = [],
}) {
  const hasLocations = Array.isArray(locations) && locations.length > 0;

  const computedCenter =
    center && Array.isArray(center) && center.length === 2
      ? center
      : hasLocations
        ? [locations[0].lat, locations[0].lng]
        : [20.5937, 78.9629]; // fallback: India

  const bounds = React.useMemo(() => {
    if (!hasLocations) return null;
    const latLngs = locations
      .filter((x) => Number.isFinite(x?.lat) && Number.isFinite(x?.lng))
      .map((x) => [x.lat, x.lng]);
    if (latLngs.length === 0) return null;
    return L.latLngBounds(latLngs);
  }, [locations, hasLocations]);

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden ring-1 ring-white/10">
      <MapContainer
        center={computedCenter}
        zoom={hasLocations ? 11 : 4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        bounds={bounds || undefined}
        boundsOptions={{ padding: [20, 20] }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Array.isArray(polyline) && polyline.length > 1 && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: "#fbbf24", weight: 5, opacity: 0.85 }}
          />
        )}

        {locations.map((loc, idx) => (
          <Marker
            key={`${loc?.name ?? "loc"}-${idx}-${loc?.lat}-${loc?.lng}`}
            position={[loc.lat, loc.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{loc.name}</div>
                {loc.day != null && (
                  <div className="text-xs text-gray-600">Day {loc.day}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


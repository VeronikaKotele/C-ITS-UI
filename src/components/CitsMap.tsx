import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { IntersectionState, VehicleState } from "../types";
import "leaflet/dist/leaflet.css";

type Props = {
  vehicles: Record<number, VehicleState>;
  intersections: Record<number, IntersectionState>;
};

function makeEmojiIcon(emoji: string, className: string) {
  return L.divIcon({
    html: `<div class="map-icon ${className}">${emoji}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const icons = {
  BUS: makeEmojiIcon("🚌", "bus"),
  EMERGENCY: makeEmojiIcon("🚑", "emergency"),
  PASSENGER_CAR: makeEmojiIcon("🚗", "car"),
  RSU: makeEmojiIcon("🚦", "intersection"),
};

export function CitsMap({ vehicles, intersections }: Props) {
  const center: [number, number] = [48.776, 9.183];

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.values(vehicles).map((vehicle) => (
        <Marker
            key={vehicle.stationId}
            position={[vehicle.lat, vehicle.lon]}
            icon={icons[vehicle.stationType] ?? icons.PASSENGER_CAR}
        >
          <Popup>
            <strong>Vehicle {vehicle.stationId}</strong>
            <br />
            Type: {vehicle.stationType}
            <br />
            Role: {vehicle.role}
            <br />
            Speed: {vehicle.speed ?? "-"}
            <br />
            Request: {vehicle.requestStatus ?? "none"}
          </Popup>
        </Marker>
      ))}

      {Object.values(vehicles)
        .filter((vehicle) => vehicle.emergencyTrail.length > 1)
        .map((vehicle) => (
          <Polyline
            key={`trail-${vehicle.stationId}`}
            positions={vehicle.emergencyTrail}
          />
        ))}

      {Object.values(intersections).map((intersection) => (
    <Marker
        key={`intersection-${intersection.stationId}`}
        position={[intersection.lat, intersection.lon]}
        icon={icons.RSU}
    >
        <Popup>
        <strong>Intersection {intersection.stationId}</strong>
        <br />
        Phase: {intersection.phase}
        <br />
        Remaining: {intersection.remainingSeconds}s
        </Popup>
    </Marker>
    ))}
    </MapContainer>
  );
}
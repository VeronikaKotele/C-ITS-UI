import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { IntersectionState, RsuState, VehicleState } from "../types";
import "leaflet/dist/leaflet.css";

type Props = {
  vehicles: Record<number, VehicleState>;
  rsus: Record<number, RsuState>;
  intersections: Record<number, IntersectionState>;
};

const vehicleIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const rsuIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function CitsMap({ vehicles, rsus, intersections }: Props) {
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
          icon={vehicleIcon}
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

      {Object.values(rsus).map((rsu) => (
        <Marker
          key={rsu.stationId}
          position={[rsu.lat, rsu.lon]}
          icon={rsuIcon}
        >
          <Popup>
            <strong>RSU {rsu.stationId}</strong>
            <br />
            Roadside Unit
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
          key={`intersection-${intersection.intersectionId}`}
          position={center}
          icon={rsuIcon}
        >
          <Popup>
            <strong>Intersection {intersection.intersectionId}</strong>
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
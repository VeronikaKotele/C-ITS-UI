import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import type { IntersectionState, VehicleState } from "../types";
import { IntersectionMarker } from "./IntersectionMarker";
import { VehicleMarker } from "./VehicleMarker";
import { RequestWaitingTrail } from "./RequestWaitingTrail";

type Props = {
  vehicles: Record<number, VehicleState>;
  intersections: Record<number, IntersectionState>;
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

      {Object.values(intersections).map((intersection) => (
        <IntersectionMarker
          key={`intersection-${intersection.stationId}`}
          intersection={intersection}
        />
      ))}

      {Object.values(vehicles).map((vehicle) => (
        <VehicleMarker
          key={`vehicle-${vehicle.stationId}`}
          vehicle={vehicle}
        />
      ))}

      {Object.values(vehicles)
        .filter((vehicle) => vehicle.requestStatus === "PENDING" && vehicle.emergencyTrail.length > 1)
        .map((vehicle) => (
          <RequestWaitingTrail
            key={`trail-${vehicle.stationId}`}
            vehicle={vehicle}
          />
        ))}
    </MapContainer>
  );
}
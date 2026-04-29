import { Marker, Popup } from "react-leaflet";
import type { VehicleState } from "../types";
import "leaflet/dist/leaflet.css";
import { icons } from "./icons";

type Props = {
  vehicle: VehicleState;
};

export function VehicleMarker({ vehicle }: Props) {
    return (
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
    );
}
import type { VehicleState } from "../types";
import { Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  vehicle: VehicleState;
};

export function RequestWaitingTrail({ vehicle }: Props) {
    if (vehicle.requestStatus !== "PENDING" || (vehicle.requestWaitingTrail?.length || 0) <= 1) {
        return null;
    }
    return (
        <Polyline
            positions={vehicle.requestWaitingTrail}
            pathOptions={{ color: "red", weight: 3, dashArray: "5, 10" }}
        />
    );
}
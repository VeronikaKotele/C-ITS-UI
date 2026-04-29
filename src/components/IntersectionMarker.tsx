import { Marker, Popup } from "react-leaflet";
import type { IntersectionState } from "../types";
import "leaflet/dist/leaflet.css";
import { icons } from "./icons";

type Props = {
  intersection: IntersectionState;
};

export function IntersectionMarker({ intersection }: Props) {
  return (
    <Marker
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
  );
}
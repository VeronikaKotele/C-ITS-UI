import { Marker, Popup } from "react-leaflet";
import type { IntersectionState } from "../types";
import { getIcon } from "./icons";

type Props = {
  intersection: IntersectionState;
};

export function IntersectionMarker({ intersection }: Props) {
  return (
    <Marker
      position={[intersection.lat, intersection.lon]}
      icon={getIcon("RSU", intersection.phase)}
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
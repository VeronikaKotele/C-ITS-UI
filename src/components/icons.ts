import L from "leaflet";
import "leaflet/dist/leaflet.css";


function makeEmojiIcon(emoji: string, className: string) {
  return L.divIcon({
    html: `<div class="map-icon ${className}">${emoji}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export const icons = {
  BUS: makeEmojiIcon("🚌", "bus"),
  EMERGENCY: makeEmojiIcon("🚑", "emergency"),
  PASSENGER_CAR: makeEmojiIcon("🚗", "car"),
  RSU: makeEmojiIcon("🚦", "intersection"),
};
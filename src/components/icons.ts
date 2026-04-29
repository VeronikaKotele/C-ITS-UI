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

export function getIcon(type: string, state: string = "") {
  switch (type) {
    case "RSU":
      return makeEmojiIcon("🚦", "intersection " + state.toLowerCase());
    case "BUS":
      return makeEmojiIcon("🚌", "bus " + state.toLowerCase());
    case "EMERGENCY":
      return makeEmojiIcon("🚑", "emergency " + state.toLowerCase());
    case "PASSENGER_CAR":
    default:
      return makeEmojiIcon("🚗", "car " + state.toLowerCase());
  }
}
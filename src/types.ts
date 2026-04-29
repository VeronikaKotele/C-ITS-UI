export type StationType =
  | "PASSENGER_CAR"
  | "BUS"
  | "EMERGENCY"
  | "RSU";

export type VehicleRole =
  | "DEFAULT"
  | "PUBLIC_TRANSPORT"
  | "EMERGENCY";

export type RequestStatus =
  | "PENDING"
  | "GRANTED"
  | "REJECTED";

export type SignalPhase =
  | "RED"
  | "YELLOW"
  | "GREEN";

export type CitsEvent =
  | CamEvent
  | SremEvent
  | SsemEvent
  | SpatemEvent;

export type CamEvent = {
  type: "cam";
  stationId: number;
  stationType: StationType;
  role: VehicleRole;
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
  timestampMs: number;
};

export type SremEvent = {
  type: "srem";
  requestId: number;
  stationId: number;
  intersectionId: number;
  timestampMs: number;
};

export type SsemEvent = {
  type: "ssem";
  requestId: number;
  stationId: number;
  intersectionId: number;
  status: RequestStatus;
  timestampMs: number;
};

export type SpatemEvent = {
  type: "spatem";
  intersectionId: number;
  phase: SignalPhase;
  remainingSeconds: number;
  timestampMs: number;
  lat: number;
  lon: number;
};

export type VehicleState = {
  stationId: number;
  stationType: StationType;
  role: VehicleRole;
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
  lastSeenMs: number;

  activeRequestId?: number;
  requestStatus?: RequestStatus;
  lastRequestResolvedMs?: number;
  requestWaitingTrail: Array<[number, number]>;
};

export type IntersectionState = {
  stationId: number;
  lat: number;
  lon: number;
  phase: SignalPhase;
  remainingSeconds: number;
};

export type AppState = {
  vehicles: Record<number, VehicleState>;
  intersections: Record<number, IntersectionState>;
  totalCamCount: number;
};

export function translateStationType(type: string): StationType {
  switch (type) {
    case "STATION_TYPE_PASSENGER_CAR":
      return "PASSENGER_CAR";
    case "STATION_TYPE_BUS":
      return "BUS";
    case "STATION_TYPE_SPECIAL_VEHICLES":
      return "EMERGENCY";
    case "STATION_TYPE_ROAD_SIDE_UNIT":
      return "RSU";
    default:
      return "PASSENGER_CAR";
  }
}

export function translateRole(role: string): VehicleRole {
  switch (role) {
    case "VEHICLE_ROLE_DEFAULT":
      return "DEFAULT";
    case "VEHICLE_ROLE_PUBLIC_TRANSPORT":
      return "PUBLIC_TRANSPORT";
    case "VEHICLE_ROLE_EMERGENCY":
      return "EMERGENCY";
    default:
      return "DEFAULT";
  }
}
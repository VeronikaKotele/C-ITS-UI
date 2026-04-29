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
  | SpatemEvent
  | LogsEvent;

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

export type LogsEvent = {
  type: "logs";
  stationId: number;
  stationType: StationType;
  message: string;
  timestampMs: number;
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

  logs: Array<{
    timestampMs: number;
    message: string;
  }>;
};

export type IntersectionState = {
  stationId: number;
  lat: number;
  lon: number;
  phase: SignalPhase;
  remainingSeconds: number;

  logs: Array<{
    timestampMs: number;
    message: string;
  }>;
};

export type AppState = {
  vehicles: Record<number, VehicleState>;
  intersections: Record<number, IntersectionState>;
  totalCamCount: number;
};

export function translateStationType(type: string): StationType {
  switch (type) {
    case "PASSENGER_CAR":
      return "PASSENGER_CAR";
    case "BUS":
      return "BUS";
    case "SPECIAL_VEHICLES":
      return "EMERGENCY";
    case "ROAD_SIDE_UNIT":
      return "RSU";
    default:
      return "PASSENGER_CAR";
  }
}

export function translateRole(role: string): VehicleRole {
  switch (role) {
    case "DEFAULT":
      return "DEFAULT";
    case "PUBLIC_TRANSPORT":
      return "PUBLIC_TRANSPORT";
    case "EMERGENCY":
      return "EMERGENCY";
    default:
      return "DEFAULT";
  }
}
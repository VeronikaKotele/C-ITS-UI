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

  isTracingEmergency: boolean;
  emergencyTrail: Array<[number, number]>;
};

export type IntersectionState = {
  stationId: number;
  lat: number;
  lon: number;
  phase: SignalPhase;
  remainingSeconds: number;
  activeRequests: Record<number, RequestStatus>;
};
import {
  type CitsEvent,
  type AppState, 
  translateRole,
  translateStationType
} from "../types";

export function appStateReducerOnCitsEvent(state: AppState, event: CitsEvent): AppState {
  switch (event.type) {
    case "cam": {
      const previous = state.vehicles[event.stationId];

      const shouldTrace =
        previous?.isTracingEmergency || false;

      const nextPosition: [number, number] = [event.lat, event.lon];

      return {
        ...state,
        totalCamCount: state.totalCamCount + 1,
        vehicles: {
          ...state.vehicles,
          [event.stationId]: {
            stationId: event.stationId,
            stationType: translateStationType(event.stationType),
            role: translateRole(event.role),
            lat: event.lat,
            lon: event.lon,
            speed: event.speed,
            heading: event.heading,
            lastSeenMs: event.timestampMs,
            activeRequestId: previous?.activeRequestId,
            requestStatus: previous?.requestStatus,
            isTracingEmergency: shouldTrace,
            emergencyTrail: shouldTrace
              ? [...(previous?.emergencyTrail ?? []), nextPosition]
              : previous?.emergencyTrail ?? [],
          },
        },
      };
    }

    case "srem": {
      const vehicle = state.vehicles[event.stationId];

      if (!vehicle) {
        return state;
      }

      return {
        ...state,
        vehicles: {
          ...state.vehicles,
          [event.stationId]: {
            ...vehicle,
            activeRequestId: event.requestId,
            requestStatus: "PENDING",
            isTracingEmergency: vehicle.role === "EMERGENCY",
            emergencyTrail:
              vehicle.role === "EMERGENCY"
                ? [[vehicle.lat, vehicle.lon]]
                : vehicle.emergencyTrail,
          },
        },
      };
    }

    case "ssem": {
      const vehicle = state.vehicles[event.stationId];

      const updatedVehicles = vehicle
        ? {
            ...state.vehicles,
            [event.stationId]: {
              ...vehicle,
              requestStatus: event.status,
              isTracingEmergency: false,
            },
          }
        : state.vehicles;

      const previousIntersection =
        state.intersections[event.intersectionId];

      return {
        ...state,
        vehicles: updatedVehicles,
        intersections: {
          ...state.intersections,
          [event.intersectionId]: {
            stationId: event.intersectionId,
            lat: previousIntersection?.lat ?? 48.776,
            lon: previousIntersection?.lon ?? 9.183,
            phase: previousIntersection?.phase ?? "RED",
            remainingSeconds:
              previousIntersection?.remainingSeconds ?? 0,
            activeRequests: {
              ...(previousIntersection?.activeRequests ?? {}),
              [event.requestId]: event.status,
            },
          },
        },
      };
    }

    case "spatem": {
      const previous = state.intersections[event.intersectionId];

      return {
        ...state,
        intersections: {
          ...state.intersections,
          [event.intersectionId]: {
            stationId: event.intersectionId,
            lat: previous?.lat ?? 48.776,
            lon: previous?.lon ?? 9.183,
            phase: event.phase,
            remainingSeconds: event.remainingSeconds,
            activeRequests: previous?.activeRequests ?? {},
          },
        },
      };
    }

    default:
      return state;
  }
}
import { useEffect, useReducer } from "react";
import { CitsMap } from "./components/CitsMap";
import { startMockCitsStream } from "./ws";
import type {
  CitsEvent,
  IntersectionState,
  RsuState,
  VehicleState,
} from "./types";

type AppState = {
  vehicles: Record<number, VehicleState>;
  rsus: Record<number, RsuState>;
  intersections: Record<number, IntersectionState>;
  totalCamCount: number;
};

const initialState: AppState = {
  vehicles: {},
  rsus: {},
  intersections: {},
  totalCamCount: 0,
};

function reducer(state: AppState, event: CitsEvent): AppState {
  switch (event.type) {
    case "cam": {
      if (event.stationType === "RSU") {
        return {
          ...state,
          totalCamCount: state.totalCamCount + 1,
          rsus: {
            ...state.rsus,
            [event.stationId]: {
              stationId: event.stationId,
              lat: event.lat,
              lon: event.lon,
            },
          },
        };
      }

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
            stationType: event.stationType,
            role: event.role,
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
            intersectionId: event.intersectionId,
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
            intersectionId: event.intersectionId,
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

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stop = startMockCitsStream(dispatch);
    return stop;
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>C-ITS Live Dashboard</h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <CitsMap
          vehicles={state.vehicles}
          rsus={state.rsus}
          intersections={state.intersections}
        />

        <aside>
          <h2>Status</h2>

          <p>
            <strong>CAM received:</strong> {state.totalCamCount}
          </p>

          <h3>Intersections</h3>
          {Object.values(state.intersections).map((intersection) => (
            <div
              key={intersection.intersectionId}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <strong>Intersection {intersection.intersectionId}</strong>
              <br />
              Phase: {intersection.phase}
              <br />
              Remaining: {intersection.remainingSeconds}s
              <br />
              Active requests:
              <pre>
                {JSON.stringify(intersection.activeRequests, null, 2)}
              </pre>
            </div>
          ))}

          <h3>Vehicles</h3>
          {Object.values(state.vehicles).map((vehicle) => (
            <div
              key={vehicle.stationId}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <strong>Vehicle {vehicle.stationId}</strong>
              <br />
              Type: {vehicle.stationType}
              <br />
              Role: {vehicle.role}
              <br />
              Request: {vehicle.requestStatus ?? "none"}
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
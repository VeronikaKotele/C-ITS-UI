import type { AppState } from "../types";
import { CamHistogram } from "./CamHistogram";

type Props = {
  state: AppState;
};

export function StatusDashboard({ state }: Props) {
  return (
    <aside>
      <h2>Status Dashboard</h2>

        <p>
        <strong>CAM received:</strong> {state.totalCamCount}
        </p>

        <h3>Intersections</h3>
        {Object.values(state.intersections).map((intersection) => (
          <div
              key={intersection.stationId}
              style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              }}
          >
            <strong>Intersection {intersection.stationId}</strong>
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
      <CamHistogram />
    </aside>
  );
}
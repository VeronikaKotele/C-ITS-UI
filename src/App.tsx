import { useEffect, useReducer } from "react";
import { type AppState } from "./types";
import { appStateReducerOnCitsEvent } from "./stateManagers/appStateManager";
import { CitsMap } from "./components/CitsMap";
import { StatusDashboard } from "./components/StatusDashboard";
import { startCitsWebSocket } from "./ws";

const initialState: AppState = {
  vehicles: {},
  intersections: {},
  totalCamCount: 0,
};

export default function App() {
  const [state, dispatch] = useReducer(appStateReducerOnCitsEvent, initialState);

  useEffect(() => {
    const stop = startCitsWebSocket(dispatch);
    return stop;
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ display: "none" }}>C-ITS Live Dashboard</h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <CitsMap
          vehicles={state.vehicles}
          intersections={state.intersections}
        />

        <StatusDashboard state={state} />

      </section>
    </main>
  );
}
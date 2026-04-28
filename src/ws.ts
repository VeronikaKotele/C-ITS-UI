import type { CitsEvent, SignalPhase } from "./types";

type Listener = (event: CitsEvent) => void;

export function startMockCitsStream(onEvent: Listener): () => void {
  let tick = 0;
  let requestSent = false;
  let responseSent = false;

  const vehicles = [
    {
      stationId: 42,
      stationType: "BUS" as const,
      role: "PUBLIC_TRANSPORT" as const,
      lat: 48.7758,
      lon: 9.1829,
    },
    {
      stationId: 77,
      stationType: "PASSENGER_CAR" as const,
      role: "DEFAULT" as const,
      lat: 48.7765,
      lon: 9.184,
    },
    {
      stationId: 112,
      stationType: "EMERGENCY" as const,
      role: "EMERGENCY" as const,
      lat: 48.7748,
      lon: 9.181,
    },
    {
      stationId: 9001,
      stationType: "RSU" as const,
      role: "DEFAULT" as const,
      lat: 48.776,
      lon: 9.183,
    },
  ];

  const timerId = window.setInterval(() => {
    const now = Date.now();
    tick++;

    for (const vehicle of vehicles) {
      if (vehicle.stationType === "RSU") {
        onEvent({
          type: "cam",
          stationId: vehicle.stationId,
          stationType: vehicle.stationType,
          role: vehicle.role,
          lat: vehicle.lat,
          lon: vehicle.lon,
          timestampMs: now,
        });
        continue;
      }

      const movement = tick * 0.00008;

      onEvent({
        type: "cam",
        stationId: vehicle.stationId,
        stationType: vehicle.stationType,
        role: vehicle.role,
        lat: vehicle.lat + movement,
        lon: vehicle.lon + movement * 0.6,
        speed: vehicle.role === "EMERGENCY" ? 52 : 34,
        heading: 80,
        timestampMs: now,
      });
    }

    if (tick === 5 && !requestSent) {
      requestSent = true;

      onEvent({
        type: "srem",
        requestId: 1001,
        stationId: 112,
        intersectionId: 1,
        timestampMs: now,
      });
    }

    if (tick === 12 && !responseSent) {
      responseSent = true;

      onEvent({
        type: "ssem",
        requestId: 1001,
        stationId: 112,
        intersectionId: 1,
        status: "GRANTED",
        timestampMs: now,
      });
    }

    const phases: SignalPhase[] = ["RED", "GREEN", "YELLOW"];

    onEvent({
      type: "spatem",
      intersectionId: 1,
      phase: phases[Math.floor(tick / 6) % phases.length],
      remainingSeconds: 20 - (tick % 20),
      timestampMs: now,
    });
  }, 1000);

  return () => window.clearInterval(timerId);
}
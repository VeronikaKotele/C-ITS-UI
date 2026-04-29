import { act } from "react";
import { VehicleMarker } from "../components/VehicleMarker";
import {
  type CitsEvent,
  type AppState,
  translateRole,
  translateStationType,
  type VehicleState,
} from "../types";

export function appStateReducerOnCitsEvent(state: AppState, event: CitsEvent): AppState {
  switch (event.type) {
    case "cam": {
      let vehicle = state.vehicles[event.stationId];
      if (!vehicle) {
        vehicle = {
          stationId: event.stationId,
          stationType: translateStationType(event.stationType),
          role: translateRole(event.role),
          lat: event.lat,
          lon: event.lon,
          lastSeenMs: event.timestampMs,
          requestWaitingTrail: [],
        };
      }

      const shouldTrace = vehicle?.requestStatus == "PENDING" || false;
      let requestWaitingTrail = vehicle?.requestWaitingTrail ?? [];
      if (shouldTrace) {
        requestWaitingTrail.push([event.lat, event.lon]);
      }

      const cleanupRequest = vehicle?.requestStatus !== "PENDING" &&
        vehicle?.lastRequestResolvedMs &&
        event.timestampMs - vehicle?.lastRequestResolvedMs > 2000;

      const updatedVehicle: VehicleState = {
        ...vehicle,
          lat: event.lat,
          lon: event.lon,
          speed: event.speed,
          heading: event.heading,
          lastSeenMs: event.timestampMs,
          requestWaitingTrail: requestWaitingTrail,
          ...(cleanupRequest
            ? {
                activeRequestId: undefined,
                requestStatus: undefined,
                lastRequestResolvedMs: undefined,
              }
            : {}),
      };

      return {
        ...state,
        totalCamCount: state.totalCamCount + 1,
        vehicles: {
          ...state.vehicles,
          [event.stationId]: updatedVehicle,
        },
      };
    }

    case "srem": {
      const vehicle = state.vehicles[event.stationId];

      if (!vehicle) {
        return state;
      }

      const updatedVehicle: VehicleState = {
        ...vehicle,
        activeRequestId: event.requestId,
        requestStatus: "PENDING",
        lastRequestResolvedMs: undefined,
        requestWaitingTrail: [[vehicle.lat, vehicle.lon]],
      };

      return {
        ...state,
        vehicles: {
          ...state.vehicles,
          [event.stationId]: updatedVehicle,
        },
      };
    }

    case "ssem": {
      const vehicle = state.vehicles[event.stationId];
      if (!vehicle) {
        return state;
      }

      if (vehicle.activeRequestId !== event.requestId) {
        // response for a request that is not active anymore - ignore.
        return state;
      }

      const updatedVehicles = vehicle
        ? {
            ...state.vehicles,
            [event.stationId]: {
              ...vehicle,
              activeRequestId: event.requestId,
              requestStatus: event.status,
              lastRequestResolvedMs: event.status !== "PENDING" ? event.timestampMs : vehicle.lastRequestResolvedMs,
              requestWaitingTrail: [],
            },
          }
        : state.vehicles;

      return {
        ...state,
        vehicles: updatedVehicles,
      };
    }

    case "spatem": {
      let intersection = state.intersections[event.intersectionId];
      if (!intersection) {
        intersection = {
          stationId: event.intersectionId,
          lat: event.lat,
          lon: event.lon,
          phase: event.phase,
          remainingSeconds: event.remainingSeconds,
        };
      }

      return {
        ...state,
        intersections: {
          ...state.intersections,
          [event.intersectionId]: {
            ...intersection,
            phase: event.phase,
            remainingSeconds: event.remainingSeconds,
            lat: event.lat,
            lon: event.lon,
          },
        },
      };
    }

    default:
      return state;
  }
}
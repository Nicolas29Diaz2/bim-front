import { useMemo } from "react";
import { Incident } from "../types/incidents";

export function useIncidentsGeoJson(incidents: Incident[]) {
  return useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: incidents.map((inc) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [inc.coordinates.lng, inc.coordinates.lat],
        },
        properties: {
          id: inc.id,
          title: inc.title,
          status: inc.status,
          priority: inc.priority,
        },
      })),
    };
  }, [incidents]);
}

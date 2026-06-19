import { HeatmapLayerSpecification } from "mapbox-gl";

export const symbolLayer = {
  id: "incidents-symbol",
  type: "symbol" as const,
  layout: {
    "icon-image": "incident-alert-icon",
    "icon-size": 0.4,
    "icon-allow-overlap": true,
    visibility: "visible" as const,
  },
};

export const heatmapLayer: Omit<HeatmapLayerSpecification, "source"> = {
  id: "incidents-heatmap",
  type: "heatmap",
  layout: {
    visibility: "none",
  },
  paint: {
    "heatmap-weight": [
      "match",
      ["get", "priority"],
      "critical",
      1,
      "high",
      0.7,
      "medium",
      0.4,
      "low",
      0.2,
      0.1,
    ],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 12, 2, 18, 8],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,184,0,0)",
      0.15,
      "#fff8e1",
      0.3,
      "#ffe082",
      0.5,
      "#ffb300",
      0.7,
      "#ff8f00",
      0.85,
      "#e65100",
      1,
      "#bf360c",
    ],
    "heatmap-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      12,
      15,
      20,
      18,
      32,
    ],
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 12, 0.9, 18, 0.65],
  },
};

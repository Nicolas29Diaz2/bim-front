"use client";
import { useState, useCallback } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useIncidentsGeoJson } from "../../hooks/useIncidentsGeoJson";
import { Incident } from "../../types/incidents";
import Map, { Layer, MapEvent, Source } from "react-map-gl/mapbox";
import styles from "./index.module.scss";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const incidentLayerStyle = {
  id: "incidents-layer",
  type: "symbol" as const,
  layout: {
    "icon-image": "incident-alert-icon",
    "icon-size": 0.4,
    "icon-allow-overlap": true,
  },
};

export function IncidentsMap({
  incidents,
}: Readonly<{ incidents: Incident[] }>) {
  const [viewState, setViewState] = useState({
    longitude: -74.1077,
    latitude: 4.6966,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });

  const geoJson = useIncidentsGeoJson(incidents);

  const handleMapLoad = useCallback((evt: MapEvent) => {
    const map = evt.target;

    map.loadImage("/icons/alert.webp", (error, image) => {
      if (error) {
        console.error("Error cargando la imagen del icono:", error);
        return;
      }

      if (image && !map.hasImage("incident-alert-icon")) {
        map.addImage("incident-alert-icon", image);
      }
    });
  }, []);

  return (
    <div className={styles.map}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        maxPitch={85}
        onLoad={handleMapLoad}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Source id="incidents-source" type="geojson" data={geoJson}>
          <Layer {...incidentLayerStyle} />
        </Source>
      </Map>
    </div>
  );
}

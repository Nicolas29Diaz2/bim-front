"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useIncidentsGeoJson } from "../../hooks/useIncidentsGeoJson";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import {
  useMapWorkspaceStore,
  selectSelectedIncident,
} from "../../store/useMapWorkspaceStore";
import Map, {
  Layer,
  MapEvent,
  MapMouseEvent,
  Source,
  MapRef, // Añadido MapRef
} from "react-map-gl/mapbox";
import { IncidentPopup } from "../IncidentPopup";
import styles from "./index.module.scss";
import { heatmapLayer, symbolLayer } from "../../constants/mapLayers";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function IncidentsMap() {
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: -74.1077,
    latitude: 4.6966,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });

  const isCrosshairMode = useIncidentCreationStore((s) => s.isCrosshairMode);
  const captureMapPoint = useIncidentCreationStore((s) => s.captureMapPoint);

  const is3D = useMapWorkspaceStore((s) => s.is3D);
  const viewMode = useMapWorkspaceStore((s) => s.viewMode);
  const filteredIncidents = useMapWorkspaceStore((s) => s.filteredIncidents);
  const selectedIncidentId = useMapWorkspaceStore((s) => s.selectedIncidentId);
  const setSelectedIncidentId = useMapWorkspaceStore(
    (s) => s.setSelectedIncidentId,
  );

  const selectedIncident = useMapWorkspaceStore(selectSelectedIncident);
  const geoJson = useIncidentsGeoJson(filteredIncidents);

  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedIncident) {
      mapRef.current.flyTo({
        center: [
          selectedIncident.coordinates.lng,
          selectedIncident.coordinates.lat,
        ],
        zoom: 18,
        pitch: is3D ? 60 : 0,
        bearing: is3D ? -17.6 : 0,
        speed: 1.2,
        essential: true,
      });
    } else {
      mapRef.current.flyTo({
        pitch: is3D ? 60 : 0,
        bearing: is3D ? -17.6 : 0,
        duration: 800,
      });
    }
  }, [selectedIncidentId, selectedIncident, is3D]);

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

  const handleMapClick = useCallback(
    (evt: MapMouseEvent) => {
      if (isCrosshairMode) {
        const { lng, lat } = evt.lngLat;
        captureMapPoint({ lat, lng });
        return;
      }

      const features = evt.target.queryRenderedFeatures(evt.point, {
        layers: ["incidents-symbol"],
      });

      if (features && features.length > 0) {
        const featureId = features[0].properties?.id;
        if (featureId) {
          setSelectedIncidentId(String(featureId));
          return;
        }
      }

      setSelectedIncidentId(null);
    },
    [isCrosshairMode, captureMapPoint, setSelectedIncidentId],
  );

  return (
    <div className={styles.map}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        maxPitch={85}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        cursor={isCrosshairMode ? "crosshair" : "grab"}
        terrain={is3D ? { source: "mapbox-dem", exaggeration: 1.5 } : undefined}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      >
        <Source id="incidents-source" type="geojson" data={geoJson}>
          <Layer
            {...symbolLayer}
            layout={{
              ...symbolLayer.layout,
              visibility: viewMode === "markers" ? "visible" : "none",
            }}
          />
          <Layer
            {...heatmapLayer}
            layout={{
              ...heatmapLayer.layout,
              visibility: viewMode === "heatmap" ? "visible" : "none",
            }}
          />
        </Source>

        {selectedIncident && !isCrosshairMode && (
          <IncidentPopup
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
          />
        )}
      </Map>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { IncidentsMap } from "../IncidentsMap";
import { OverlayControls } from "../OverlayControls";
import { IncidentCreationModal } from "../IncidentCreationModal";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import type { Incident } from "../../types/incidents";
import styles from "./index.module.scss";

export function IncidentsWorkspace({
  initialIncidents,
}: Readonly<{ initialIncidents: Incident[] }>) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const registerOnCreated = useIncidentCreationStore(
    (s) => s.registerOnCreated,
  );

  const handleIncidentCreated = useCallback((incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  }, []);

  useEffect(() => {
    registerOnCreated(handleIncidentCreated);
  }, [registerOnCreated, handleIncidentCreated]);

  return (
    <div className={styles.workspace}>
      <IncidentsMap incidents={incidents} />
      <OverlayControls />
      <IncidentCreationModal />
    </div>
  );
}

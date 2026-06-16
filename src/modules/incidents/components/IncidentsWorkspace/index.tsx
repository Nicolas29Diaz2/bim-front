"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { IncidentsMap } from "../IncidentsMap";
import { OverlayControls } from "../OverlayControls";
import { IncidentCreationModal } from "../IncidentCreationModal";
import { IncidentDateFilter } from "../IncidentDateFilter";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import type { Incident } from "../../types/incidents";
import styles from "./index.module.scss";

export function IncidentsWorkspace({
  initialIncidents,
}: Readonly<{ initialIncidents: Incident[] }>) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const registerOnCreated = useIncidentCreationStore(
    (s) => s.registerOnCreated,
  );

  const handleIncidentCreated = useCallback((incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  }, []);

  useEffect(() => {
    registerOnCreated(handleIncidentCreated);
  }, [registerOnCreated, handleIncidentCreated]);

  const filteredIncidents = useMemo(() => {
    if (!filterDate) return incidents;
    const selected = filterDate.toISOString().slice(0, 10);
    return incidents.filter((inc) => inc.createdAt.slice(0, 10) === selected);
  }, [incidents, filterDate]);

  return (
    <div className={styles.workspace}>
      <IncidentsMap incidents={filteredIncidents} />
      <IncidentDateFilter value={filterDate} onChange={setFilterDate} />
      <OverlayControls />
      <IncidentCreationModal />
    </div>
  );
}

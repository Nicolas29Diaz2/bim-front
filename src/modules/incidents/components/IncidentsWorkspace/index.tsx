"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { IncidentsMap } from "../IncidentsMap";
import { OverlayControls } from "../OverlayControls";
import { IncidentCreationModal } from "../IncidentCreationModal";
import { TopFilterBar } from "../TopFilterBar";
import { BottomViewControls } from "../BottomViewControls";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import type { Incident } from "../../types/incidents";
import styles from "./index.module.scss";

export function IncidentsWorkspace({
  initialIncidents,
}: Readonly<{ initialIncidents: Incident[] }>) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [is3D, setIs3D] = useState(false);
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
      <IncidentsMap incidents={filteredIncidents} is3D={is3D} />
      <TopFilterBar value={filterDate} onChange={setFilterDate} />
      <BottomViewControls
        is3D={is3D}
        onToggle3D={() => setIs3D((prev) => !prev)}
      />
      <OverlayControls />
      <IncidentCreationModal />
    </div>
  );
}

"use client";

import { Popup } from "react-map-gl/mapbox";
import {
  AlertTriangle,
  Zap,
  Droplets,
  ShieldCheck,
  Triangle,
  Eye,
} from "lucide-react";
import type { Incident } from "../../types/incidents";
import styles from "./index.module.scss";

const CATEGORY_ICON: Record<string, React.ElementType> = {
  coordination: AlertTriangle,
  electrical: Zap,
  plumbing: Droplets,
  safety: ShieldCheck,
  structure: Triangle,
};

const CATEGORY_LABEL: Record<string, string> = {
  coordination: "Coordination",
  electrical: "Electrical",
  plumbing: "Plumbing",
  safety: "Safety",
  structure: "Structure",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: styles.pillLow,
  medium: styles.pillMedium,
  high: styles.pillHigh,
  critical: styles.pillCritical,
};

interface IncidentPopupProps {
  incident: Incident;
  onClose: () => void;
  onViewDetails?: (incident: Incident) => void;
}

export function IncidentPopup({
  incident,
  onClose,
  onViewDetails,
}: IncidentPopupProps) {
  const CategoryIcon = CATEGORY_ICON[incident.type.key] ?? AlertTriangle;
  const categoryLabel = CATEGORY_LABEL[incident.type.key] ?? incident.type.name;
  const pillClass = PRIORITY_STYLES[incident.priority] ?? styles.pillMedium;

  return (
    <Popup
      longitude={incident.coordinates.lng}
      latitude={incident.coordinates.lat}
      anchor="bottom"
      offset={24}
      closeOnClick={false}
      onClose={onClose}
      className={styles.popupWrapper}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.category}>
            <CategoryIcon size={14} strokeWidth={2} />
            {categoryLabel}
          </span>
          <span className={`${styles.pill} ${pillClass}`}>
            {incident.priority}
          </span>
        </div>

        <h4 className={styles.title}>{incident.title}</h4>

        <div className={styles.meta}>
          <span className={styles.statusDot} data-status={incident.status} />
          <span className={styles.statusText}>{incident.status}</span>
        </div>

        {onViewDetails && (
          <button
            type="button"
            className={styles.detailsBtn}
            onClick={() => onViewDetails(incident)}
          >
            <Eye size={14} strokeWidth={2} />
            View Full Details
          </button>
        )}
      </div>
    </Popup>
  );
}

import { AlertTriangle, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/common/utils/cn";
import type { Project } from "../../types/projects";
import styles from "./index.module.scss";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onClick: (slug: string) => void;
}

function ProjectCard({ project, onClick }: Readonly<ProjectCardProps>) {
  const statusLabel =
    project.status === "en_curso"
      ? "En Curso"
      : project.status === "planificacion"
        ? "Planificacion"
        : project.status === "completado"
          ? "Completado"
          : "Pausado";

  return (
    <article
      className={styles.card}
      onClick={() => onClick(project.slug)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project.slug);
        }
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={project.imageUrl}
          alt={project.name}
        />
        <span
          className={cn(
            styles.statusBadge,
            project.status === "planificacion" && styles.statusPlanificacion,
          )}
        >
          {statusLabel}
        </span>
        {project.incidentCount > 0 && (
          <span className={styles.incidentBadge}>
            <span className={styles.incidentIcon}>
              <AlertTriangle />
            </span>
            {project.incidentCount}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.projectName}>{project.name}</h3>
        </div>

        <span className={styles.location}>
          <span className={styles.locationIcon}>
            <MapPin />
          </span>
          {project.location}, {project.country}
        </span>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progreso General</span>
            <span className={styles.progressValue}>{project.progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.lastActivity}>
          Ultima act: {project.lastActivity}
        </span>
        <span className={styles.manageLink}>
          Gestionar <ChevronRight />
        </span>
      </div>
    </article>
  );
}

export { ProjectCard };

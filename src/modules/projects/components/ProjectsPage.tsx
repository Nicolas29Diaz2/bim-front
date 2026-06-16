"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/common/components/ui/Input";
import { Button } from "@/common/components/ui/Button";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectsPage.module.scss";
import { NewProjectCard } from "./NewProjectCard";

function ProjectsPage() {
  const router = useRouter();
  const { projects, loading } = useProjects();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const handleProjectClick = (slug: string) => {
    router.push(`/${slug}/dashboard`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mis Proyectos</h1>
      <p className={styles.subtitle}>
        Selecciona un entorno de trabajo activo para comenzar la gestion de BIM
        y supervision de obra.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Input
            placeholder="Buscar por nombre o ubicacion..."
            leadingIcon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" icon={<SlidersHorizontal size={16} />}>
          Filtrar
        </Button>
        <Button variant="primary" icon={<Plus size={16} />}>
          Nuevo Proyecto
        </Button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
          <NewProjectCard onClick={() => {}} />
        </div>
      )}
    </div>
  );
}

export { ProjectsPage };

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToastStore } from "@/common/store/toastStore";
import { getUserProjects } from "../services/getUserProjects.service";
import type { Project } from "../types/projects";

export function useProjects() {
  const [projects, setProjects] = useState<readonly Project[]>([]);
  const [loading, setLoading] = useState(false);
  const showError = useToastStore((s) => s.showError);
  const mounted = useRef(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const result = await getUserProjects();

    if (!mounted.current) return;

    if (result.ok) {
      setProjects(result.value);
    } else {
      showError(result.error);
      setProjects([]);
    }

    setLoading(false);
  }, [showError]);

  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => {
      void fetchProjects();
    }, 0);
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

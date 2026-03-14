// =============================================================
// useProjects.js — Custom hook for project data
//
// Encapsulates all project data-fetching logic.
// Components that need projects import this hook — they never
// call the service directly. This keeps components clean.
// =============================================================

import { useState, useEffect, useCallback } from "react";
import * as projectService from "../services/project.service";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data) => {
    const project = await projectService.createProject(data);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = async (id, data) => {
    const updated = await projectService.updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id) => {
    await projectService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

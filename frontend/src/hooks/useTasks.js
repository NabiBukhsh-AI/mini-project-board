// =============================================================
// useTasks.js — Custom hook for task data with filters
// =============================================================

import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/task.service";

export const useTasks = (projectId, filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(projectId, filters);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId, filters.status, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data) => {
    const task = await taskService.createTask(projectId, data);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = async (taskId, data) => {
    const updated = await taskService.updateTask(taskId, projectId, data);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  const deleteTask = async (taskId) => {
    await taskService.deleteTask(taskId, projectId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

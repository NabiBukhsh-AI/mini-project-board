import api from "./api";

/**
 * @param {string} projectId
 * @param {{ status?: string, sortBy?: string, sortOrder?: string }} filters
 */
export const getTasks = async (projectId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/projects/${projectId}/tasks${query}`);
  return res.data.data;
};

/** @param {string} projectId @param {object} data */
export const createTask = async (projectId, data) => {
  const res = await api.post(`/projects/${projectId}/tasks`, data);
  return res.data.data;
};

/** @param {string} taskId @param {string} projectId @param {object} data */
export const updateTask = async (taskId, projectId, data) => {
  const res = await api.patch(`/tasks/${taskId}`, { ...data, projectId });
  return res.data.data;
};

/** @param {string} taskId @param {string} projectId */
export const deleteTask = async (taskId, projectId) => {
  await api.delete(`/tasks/${taskId}`, { data: { projectId } });
};

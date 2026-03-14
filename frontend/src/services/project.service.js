import api from "./api";

/** @returns {Promise<import('../types').Project[]>} */
export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data.data;
};

/** @param {string} id */
export const getProject = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data.data;
};

/** @param {{ name: string, description?: string }} data */
export const createProject = async (data) => {
  const res = await api.post("/projects", data);
  return res.data.data;
};

/** @param {string} id @param {{ name?: string, description?: string }} data */
export const updateProject = async (id, data) => {
  const res = await api.patch(`/projects/${id}`, data);
  return res.data.data;
};

/** @param {string} id */
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};

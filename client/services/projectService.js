import api from "./api";

export const getAllProjects = async (page = 1, limit = 10, filters = {}) => {
  const { category, location } = filters;
  let query = `/projects?page=${page}&limit=${limit}`;
  if (category) query += `&category=${category}`;
  if (location) query += `&location=${location}`;
  const response = await api.get(query);
  let data = response.data.data || response.data;
  if (data.projects) {
    data.projects = data.projects.map((project) => {
      if (!project._id) {
        project._id = project?.id;
      }
      return project;
    });
  }
  return data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const requestAccess = async (projectId) => {
  const response = await api.post("/access", { projectId });
  return response.data;
};

export const getAccessRequests = async () => {
  const response = await api.get("/access/requests");
  return response.data;
};

export const approveAccess = async (requestId) => {
  const response = await api.put(`/access/${requestId}/approve`);
  return response.data;
};

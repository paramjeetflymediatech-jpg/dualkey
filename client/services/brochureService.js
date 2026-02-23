import api from "./api";

export const getAllBrochures = async () => {
  const response = await api.get("/brochures");
  return response.data;
};

export const createBrochure = async (brochureData) => {
  const response = await api.post("/brochures", brochureData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBrochure = async (id) => {
  const response = await api.delete(`/brochures/${id}`);
  return response.data;
};

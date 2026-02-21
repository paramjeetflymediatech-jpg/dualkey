import api from "./api";

export const image_url =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";

export const getGalleryItems = async (page = 1, limit = 12) => {
  const response = await api.get(`/gallery?page=${page}&limit=${limit}`);
  let data = response.data.data || response.data;
  if (data.gallery) {
    data.gallery = data.gallery.map((galleryItem) => {
      if (!galleryItem._id) {
        galleryItem._id = galleryItem?.id;
      }
      return galleryItem;
    });
  }
  return data;
};

export const createGalleryItem = async (formData) => {
  const response = await api.post("/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

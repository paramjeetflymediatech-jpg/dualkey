import api from "./api";
export const image_url =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";

export const getAllPosts = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  let data = response.data.data || response.data;
  if (data.posts) {
    data.posts = data.posts.map((post) => {
      if (!post._id) {
        post._id = post?.id;
      }
      return post;
    });
  }
  return data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post("/posts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

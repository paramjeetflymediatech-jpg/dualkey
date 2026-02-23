import api from "./api";

export const createInquiry = async (data) => {
  const response = await api.post("/inquiries", data);
  return response.data;
};

export const getInquiries = async (page = 1, limit = 10) => {
  const response = await api.get(`/inquiries?page=${page}&limit=${limit}`);
  let data = response.data.data || response.data;
  if (data.inquiries) {
    data.inquiries = data.inquiries.map((inquiry) => {
      if (!inquiry._id) {
        inquiry._id = inquiry?.id;
      }
      return inquiry;
    });
  }
  return data;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await api.patch(`/inquiries/${id}/status`, { status });
  return response.data;
};

export const getInquiryById = async (id) => {
  const response = await api.get(`/inquiries/${id}`);
  let inquiry = response.data.data || response.data;
  if (!inquiry._id) {
    inquiry._id = inquiry?.id;
  }
  return inquiry;
};

export const deleteInquiry = async (id) => {
  const response = await api.delete(`/inquiries/${id}`);
  return response.data;
};

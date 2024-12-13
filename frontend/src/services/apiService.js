import axios from "axios";

const API_BASE_URL = "https://infographx-backend.onrender.com/api";

export const uploadData = async (formData) => {
  // Ensure FormData is passed as expected
  if (!(formData instanceof FormData)) {
    throw new Error("Invalid input type. Expected a FormData instance.");
  }

  return await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};


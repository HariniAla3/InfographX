import axios from "axios";

const API_BASE_URL = "https://infographx-backend.onrender.com/api";

// export const uploadData = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return await axios.post(`${API_BASE_URL}/upload`, formData).then((res) => res.data);
// };

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


// export const createVisualization = async (data, config) => {
//   return await axios.post(`${API_BASE_URL}/visualize`, { data, config }).then((res) => res.data);
// };

// export const generateAnimation = async (data, config) => {
//   return await axios.post(`${API_BASE_URL}/generate-animation`, { data, config }, { responseType: "blob" });
// };

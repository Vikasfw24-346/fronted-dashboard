import axios from "axios";

const API_URL_RENDER = "https://backend-dashboard-xwpb.onrender.com";
const API_URL = import.meta.env.VITE_API_URL;
const API_URLS = import.meta.env.VITE_API_URLS;
export const fetchInsights = async (filters = {}) => {
  const { data } = await axios.get(`${API_URL_RENDER || API_URL || API_URLS}/api/insights`, {
    params: filters,
  });
  return data;
};


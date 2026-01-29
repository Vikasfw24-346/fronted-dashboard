import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchInsights = async (filters = {}) => {
  const { data } = await axios.get(`${API_URL}/api/insights`, {
    params: filters,
  });
  return data;
};


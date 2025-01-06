const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://new-reach-backend.herokuapp.com"
    : "http://localhost:5000";

export default API_BASE_URL;

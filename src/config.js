const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://new-reach-backend.herokuapp.com" // Production URL
    : "http://localhost:5000"; // Local development URL

export default API_BASE_URL;

export const ITEMS_PER_PAGE = 12;

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const PATH =
  process.env.REACT_APP_API_URL !== undefined && process.env.REACT_APP_API_URL !== ""
    ? process.env.REACT_APP_API_URL
    : isLocalhost
    ? "http://localhost:8080"
    : "";
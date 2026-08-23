export const ITEMS_PER_PAGE = 12;

export const PATH =
  process.env.REACT_APP_API_URL !== undefined && process.env.REACT_APP_API_URL !== ""
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8080";
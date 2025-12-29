
import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: `${base}/api`,
  withCredentials: true,
});

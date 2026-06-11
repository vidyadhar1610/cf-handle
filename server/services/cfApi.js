import axios from "axios";

const api = axios.create({
  baseURL: "https://codeforces.com/api",
  headers: {
    "User-Agent": "Mozilla/5.0",
  },
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getUserInfo = async (handle) => {
  await sleep(1000);

  const { data } = await api.get(
    `/user.info?handles=${handle}`
  );

  return data.result[0];
};

export const getRatingHistory = async (handle) => {
  await sleep(1000);

  const { data } = await api.get(
    `/user.rating?handle=${handle}`
  );

  return data.result;
};
export const getSubmissions = async (handle) => {
  const { data } = await api.get(
    `/user.status?handle=${handle}`
  );

  if (data.status !== "OK") {
    throw new Error(data.comment);
  }

  return data.result;
};
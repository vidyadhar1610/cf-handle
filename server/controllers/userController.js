import {
  getUserInfo,
  getRatingHistory,
  getSubmissions
} from "../services/cfApi.js";

export const getUser = async (req, res) => {
  try {
    const user = await getUserInfo(req.params.handle);

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const getUserRatingHistory = async (req, res) => {
  try {
    const data = await getRatingHistory(req.params.handle);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch rating history",
      error: error.message,
    });
  }
};
export const getUserSubmissions = async (req, res) => {
  try {
    const data = await getSubmissions(
      req.params.handle
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submissions",
    });
  }
};
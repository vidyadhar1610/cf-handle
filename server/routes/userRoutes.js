import express from "express";
import {
  getUser,
  getUserRatingHistory,
  getUserSubmissions
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:handle", getUser);
router.get("/:handle/rating", getUserRatingHistory);
router.get(
  "/:handle/submissions",
  getUserSubmissions
);

export default router;
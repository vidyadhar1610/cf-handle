import express from "express";
import {
  getContestProblems,
} from "../controllers/contestController.js";

const router = express.Router();

router.get(
  "/:contestId/problems",
  getContestProblems
);

export default router;
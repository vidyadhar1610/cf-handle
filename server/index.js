import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Codeforces Tracker API Running",
  });
});
app.use("/api/user", userRoutes);
app.use(
  "/api/contest",
  contestRoutes
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/user.route.js";
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json("Server is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});

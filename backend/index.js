import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import moduleRoutes from "./routes/module.route.js";
import lessonRoutes from "./routes/lesson.route.js";
import quizRoutes from "./routes/quiz.route.js";
import reviewRoutes from "./routes/review.route.js";
import commentsRoutes from "./routes/comment.route.js";
import categoryRoutes from "./routes/category.route.js";
import getUserRoutes from "./routes/getUser.route.js";
import quizAttemptRoutes from "./routes/quizAttempt.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import adminDashboardRoutes from "./routes/adminDashboard.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", getUserRoutes);
app.use("/api/quiz-attempt", quizAttemptRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);

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

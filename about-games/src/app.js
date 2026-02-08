const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Games News & Reviews API is running" });
});

app.use(errorMiddleware);

module.exports = app;

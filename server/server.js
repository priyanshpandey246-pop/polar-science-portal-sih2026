const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const searchRoutes = require("./routes/searchRoutes");
const expeditionRoutes = require("./routes/expeditionRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const photoRoutes = require("./routes/photoRoutes");
const videoRoutes = require("./routes/videoRoutes");
const askPolarRoutes = require("./routes/askPolarRoutes");
const activityRoutes = require("./routes/activityRoutes");
const authRoutes = require("./routes/authRoutes");
const outreachRoutes = require("./routes/outreachRoutes");
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://polar-science-portal-sih2026.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
     
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    project: "SIH 2026 Polar Science Portal",
  });
});

app.use("/api/expeditions", expeditionRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ask-polar", askPolarRoutes);
app.use("/api/outreach", outreachRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
};

start();
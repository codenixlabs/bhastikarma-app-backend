import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import patientRoutes from "./routes/patientRoutes.js";
import poorvaKarmaRoutes from "./routes/poorvaKarmaRoutes.js";
import pradhanaKarmaRoutes from "./routes/pradhanaKarmaRoutes.js";
import paschatKarmaRoutes from "./routes/paschatKarmaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import masterDataRoutes from "./routes/masterDataRoutes.js";

const app = express();

dotenv.config();

const PORT = 4000;

connectDB();

cloudinaryConnect();

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

import rateLimit from "express-rate-limit";

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use("/api/patients", patientRoutes);
app.use("/api/poorva-karma", poorvaKarmaRoutes);
app.use("/api/pradhana-karma", pradhanaKarmaRoutes);
app.use("/api/paschata-karma", paschatKarmaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/master", masterDataRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
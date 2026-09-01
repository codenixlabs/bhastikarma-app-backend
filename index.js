import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import patientRoutes from "./routes/patientRoutes.js";
import poorvaKarmaRoutes from "./routes/poorvaKarmaRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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

app.use("/api/patients", patientRoutes);
app.use("/api/poorva-karma", poorvaKarmaRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
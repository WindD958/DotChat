import express from "express";
import dotenv from "dotenv";
import cookieParse from "cookie-parser";

import { connectDB } from "../libs/db.js";
import authRoute from "../routes/authRoute.js";
import { authMe } from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParse());

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", authMe);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server bắt đầu trên cổng ${PORT}`);
    });
});

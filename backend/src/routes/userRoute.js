import express from "express";
import {
    authMe,
    searchUserByUsername,
    uploadAvatar,
} from "../controllers/userController.js";
import {
    getSettings,
    updateSettings,
} from "../controllers/settingController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/settings", getSettings);
router.patch("/settings", updateSettings);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export default router;

import { UserRole } from "@prisma/client";
import express from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ReadingMaterialController } from "./reading-material.controllers";
import { ReadingMaterialValidation } from "./reading-material.validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
    "/",
    auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.MODERATOR),
    upload.single("file"),
    (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    validateRequest(ReadingMaterialValidation.createReadingMaterialZodSchema),
    ReadingMaterialController.createReadingMaterial
);

router.get(
    "/",
    auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.MODERATOR),
    ReadingMaterialController.getAllReadingMaterials
);

router.get(
    "/:id",
    auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.MODERATOR),
    ReadingMaterialController.getReadingMaterialById
);

router.delete(
    "/:id",
    auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.MODERATOR),
    ReadingMaterialController.deleteReadingMaterial
);

export const ReadingMaterialRoutes = router;

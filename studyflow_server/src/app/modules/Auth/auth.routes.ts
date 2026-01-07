import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controllers";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
    "/login",
    validateRequest(AuthValidation.loginZodSchema),
    AuthControllers.login
);

router.post(
    "/register",
    validateRequest(AuthValidation.registerZodSchema),
    AuthControllers.register
);

router.post(
    "/refresh-token",
    validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthControllers.refreshToken
);

export const AuthRoutes = router;

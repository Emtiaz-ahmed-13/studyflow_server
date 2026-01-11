"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingMaterialRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const reading_material_controllers_1 = require("./reading-material.controllers");
const reading_material_validation_1 = require("./reading-material.validation");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR), upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(reading_material_validation_1.ReadingMaterialValidation.createReadingMaterialZodSchema), reading_material_controllers_1.ReadingMaterialController.createReadingMaterial);
router.get("/", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR), reading_material_controllers_1.ReadingMaterialController.getAllReadingMaterials);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR), reading_material_controllers_1.ReadingMaterialController.getReadingMaterialById);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR), reading_material_controllers_1.ReadingMaterialController.deleteReadingMaterial);
exports.ReadingMaterialRoutes = router;

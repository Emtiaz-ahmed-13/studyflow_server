"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const note_controllers_1 = require("./note.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), note_controllers_1.NoteController.createNote);
router.get("/", (0, auth_1.default)(), note_controllers_1.NoteController.getMyNotes);
router.get("/marketplace", (0, auth_1.default)(), note_controllers_1.NoteController.getMarketplaceNotes); // New route
router.post("/:id/rate", (0, auth_1.default)(), note_controllers_1.NoteController.rateNote); // New route
router.post("/:id/flashcards", (0, auth_1.default)(), note_controllers_1.NoteController.generateFlashcards); // New route
router.get("/:id", (0, auth_1.default)(), note_controllers_1.NoteController.getNoteById);
router.patch("/:id", (0, auth_1.default)(), note_controllers_1.NoteController.updateNote);
router.delete("/:id", (0, auth_1.default)(), note_controllers_1.NoteController.deleteNote);
exports.NoteRoutes = router;

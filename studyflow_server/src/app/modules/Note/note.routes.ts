import express from "express";
import auth from "../../middleware/auth";
import { NoteController } from "./note.controllers";

const router = express.Router();

router.post("/", auth(), NoteController.createNote);
router.get("/", auth(), NoteController.getMyNotes);
router.get("/marketplace", auth(), NoteController.getMarketplaceNotes); // New route
router.post("/:id/rate", auth(), NoteController.rateNote); // New route
router.post("/:id/flashcards", auth(), NoteController.generateFlashcards); // New route
router.get("/:id", auth(), NoteController.getNoteById);
router.patch("/:id", auth(), NoteController.updateNote);
router.delete("/:id", auth(), NoteController.deleteNote);

export const NoteRoutes = router;

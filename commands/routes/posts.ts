import express from "express";

// Controllers
import { createPost, createPostComment } from "../controllers/posts";

const router = express.Router();

router.post("/", createPost);
router.post("/:id/comments", createPostComment);

export default router;

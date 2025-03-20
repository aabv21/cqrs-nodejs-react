import express from "express";

// Controllers
import {
  createPost,
  createPostComment,
  deletePost,
  deleteComment,
} from "../controllers/posts";

const router = express.Router();

router.post("/", createPost);
router.post("/:id/comments", createPostComment);
router.delete("/:id", deletePost);
router.delete("/:postId/comments/:commentId", deleteComment);

export default router;

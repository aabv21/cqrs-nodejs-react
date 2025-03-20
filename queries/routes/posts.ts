// Express
import express from "express";

// Controllers
import { getPosts, getPostwithComments } from "../controllers/posts";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostwithComments);

export default router;

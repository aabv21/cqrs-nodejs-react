// Types
import { Request, Response } from "express";
import {
  CommandResponse,
  CreatePostCommand,
  AddCommentCommand,
} from "../../shared/types";

// MySQL connection
import { getDb } from "../config/mysql";

// Event producers
import { publishPostCreated } from "../events/producers/post-created.producer";
import { publishCommentAdded } from "../events/producers/comment-added.producer";

// Add import for ResultSetHeader
import { ResultSetHeader } from "mysql2";

/**
 * Create a post
 * @param req - Request object
 * @param res - Response object
 */
const createPost = async (req: Request, res: Response) => {
  const command: CreatePostCommand = {
    type: "CREATE_POST",
    payload: req.body,
  };

  try {
    const db = await getDb();
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO posts (title, content, author_email) VALUES (?, ?, ?)",
      [
        command.payload.title,
        command.payload.content,
        command.payload.author_email,
      ]
    );

    // Publish event using the producer
    await publishPostCreated(result.insertId, command);

    const response: CommandResponse = {
      success: true,
      data: { id: result.insertId },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating post:", error);
    const response: CommandResponse = {
      success: false,
      error: "Failed to create post",
    };
    res.status(500).json(response);
  }
};

/**
 * Create a comment for a post
 * @param req - Request object
 * @param res - Response object
 */
const createPostComment = async (req: Request, res: Response) => {
  console.log("createPostComment");
  const command: AddCommentCommand = {
    type: "ADD_COMMENT",
    payload: { ...req.body, post_id: parseInt(req.params.id) },
  };

  console.log(command);
  try {
    const db = await getDb();
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO comments (post_id, content, email) VALUES (?, ?, ?)",
      [command.payload.post_id, command.payload.content, command.payload.email]
    );

    // Publish event using the producer
    await publishCommentAdded(result.insertId, command);

    const response: CommandResponse = {
      success: true,
      data: { id: result.insertId },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    const response: CommandResponse = {
      success: false,
      error: "Failed to create comment",
    };
    res.status(500).json(response);
  }
};

export { createPost, createPostComment };

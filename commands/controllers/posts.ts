// Types
import { Request, Response } from "express";
import {
  CommandResponse,
  CreatePostCommand,
  AddCommentCommand,
  DeletePostCommand,
  DeleteCommentCommand,
} from "../../shared/types";

// MySQL connection
import { getDb } from "../config/mysql";

// Event producers
import { publishPostCreated } from "../events/producers/post-created.producer";
import { publishCommentAdded } from "../events/producers/comment-added.producer";
import { publishPostDeleted } from "../events/producers/post-deleted.producer";
import { publishCommentDeleted } from "../events/producers/comment-deleted.producer";

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
  const command: AddCommentCommand = {
    type: "ADD_COMMENT",
    payload: { ...req.body, post_id: parseInt(req.params.id) },
  };

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

/**
 * Delete a post
 */
const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);

  if (!postId) {
    res.status(400).json({ error: "Missing postId" });
    return;
  }

  const command: DeletePostCommand = {
    type: "DELETE_POST",
    payload: { id: postId },
  };

  try {
    const db = await getDb();
    const connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete all comments first (maintaining referential integrity)
      await connection.execute("DELETE FROM comments WHERE post_id = ?", [
        command.payload.id,
      ]);

      // Then delete the post
      const [result] = await connection.execute<ResultSetHeader>(
        "DELETE FROM posts WHERE id = ?",
        [command.payload.id]
      );

      // If post wasn't found, throw error
      if (result.affectedRows === 0) {
        throw new Error("Post not found");
      }

      // If everything succeeded, commit the transaction
      await connection.commit();

      // Publish delete event
      await publishPostDeleted(command.payload.id);

      const response: CommandResponse = {
        success: true,
        data: { id: command.payload.id },
      };

      res.status(200).json(response);
    } catch (error) {
      // If anything fails, rollback the transaction
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    const response: CommandResponse = {
      success: false,
      error: "Failed to delete post",
    };
    res.status(500).json(response);
  }
};

/**
 * Delete a comment
 */
const deleteComment = async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const postId = parseInt(req.params.postId);

  if (!commentId || !postId) {
    res.status(400).json({ error: "Missing commentId or postId" });
    return;
  }

  const command: DeleteCommentCommand = {
    type: "DELETE_COMMENT",
    payload: {
      id: commentId,
      post_id: postId,
    },
  };

  try {
    const db = await getDb();
    await db.execute("DELETE FROM comments WHERE id = ? AND post_id = ?", [
      commentId,
      postId,
    ]);

    // Publish delete event
    await publishCommentDeleted({
      id: commentId,
      post_id: postId,
    });

    const response: CommandResponse = {
      success: true,
      data: { comment_id: commentId, post_id: postId },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting comment:", error);
    const response: CommandResponse = {
      success: false,
      error: "Failed to delete comment",
    };
    res.status(500).json(response);
  }
};

export { createPost, createPostComment, deletePost, deleteComment };

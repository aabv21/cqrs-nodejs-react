import { Request, Response } from "express";
import { PostsQuery, QueryResponse, Post } from "../../shared/types";
import { db } from "../config/mongo";

/**
 * Get all posts
 * @param req
 * @param res
 */
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const query: PostsQuery = {
    type: "GET_ALL_POSTS",
    payload: {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      author_email: req.query.author_email as string,
    },
  };

  if (!query.payload.page || !query.payload.limit) {
    res.status(400).json({ error: "Page and limit are required" });
    return;
  }

  try {
    const posts = await db
      .collection("posts")
      .find(
        query.payload.author_email
          ? { author_email: query.payload.author_email }
          : {}
      )
      .skip((query.payload.page - 1) * query.payload.limit)
      .limit(query.payload.limit)
      .toArray();

    const total = await db.collection("posts").countDocuments();

    const response: QueryResponse<Post[]> = {
      success: true,
      data: posts,
      metadata: {
        total,
        page: query.payload.page,
        limit: query.payload.limit,
      },
    };

    res.json(response);
  } catch (error) {
    const response: QueryResponse = {
      success: false,
      error: "Failed to fetch posts",
    };
    res.status(500).json(response);
  }
};

/**
 * Get a single post with comments
 * @param req
 * @param res
 */
export const getPostwithComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const post = await db
      .collection("posts")
      .findOne({ _id: parseInt(req.params.id) });
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

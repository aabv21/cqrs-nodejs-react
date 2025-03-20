import { Event } from "../../../shared/types";
import { db } from "../../config/mongo";

export const postCreatedConsumer = async (event: Event) => {
  try {
    await db.collection("posts").insertOne({
      _id: event.data.id,
      title: event.data.title,
      content: event.data.content,
      author_email: event.data.author_email,
      comments: [],
      createdAt: new Date(event.timestamp),
    });

    console.log(`Post created with ID: ${event.data.id}`);
  } catch (error) {
    console.error("Error processing POST_CREATED event:", error);
    throw error; // Re-throw to handle in the main consumer
  }
};

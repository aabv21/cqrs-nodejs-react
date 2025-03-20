import { Event } from "../../../shared/types";
import { db } from "../../config/mongo";

export const commentAddedConsumer = async (event: Event) => {
  try {
    await db.collection("posts").updateOne(
      { _id: parseInt(event.data.post_id) },
      {
        $push: {
          comments: {
            id: event.data.id,
            content: event.data.content,
            email: event.data.email,
            createdAt: new Date(event.timestamp),
          },
        },
      }
    );

    console.log(`Comment added to post ${event.data.post_id}`);
  } catch (error) {
    console.error("Error processing COMMENT_ADDED event:", error);
    throw error; // Re-throw to handle in the main consumer
  }
};

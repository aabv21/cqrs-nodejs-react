import { Event } from "../../../shared/types";
import { db } from "../../config/mongo";

export const commentDeletedConsumer = async (event: Event) => {
  try {
    await db
      .collection("posts")
      .updateOne(
        { _id: event.data.post_id },
        { $pull: { comments: { id: event.data.id } } }
      );

    console.log(`Comment deleted from post ${event.data.post_id}`);
  } catch (error) {
    console.error("Error processing COMMENT_DELETED event:", error);
    throw error; // Re-throw to handle in the main consumer
  }
};

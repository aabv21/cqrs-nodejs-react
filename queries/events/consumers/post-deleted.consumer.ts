import { Event } from "../../../shared/types";
import { db } from "../../config/mongo";

export const postDeletedConsumer = async (event: Event) => {
  try {
    await db.collection("posts").deleteOne({ _id: event.data.id });
  } catch (error) {
    console.error("Error processing POST_DELETED event:", error);
    throw error; // Re-throw to handle in the main consumer
  }
};

import { Event } from "../../../shared/types";
import { channel } from "../../config/rabbitmq";

export const publishEvent = async (event: Event) => {
  try {
    channel.publish("blog_events", "", Buffer.from(JSON.stringify(event)));
    console.log(`Event published: ${event.type}`);
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
};

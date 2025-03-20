import { Event, EventType } from "../../../shared/types";

// Consumers
import { postCreatedConsumer } from "./post-created.consumer";
import { commentAddedConsumer } from "./comment-added.consumer";

export const handleEvent = async (event: Event) => {
  switch (event.type) {
    case EventType.POST_CREATED:
      await postCreatedConsumer(event);
      break;
    case EventType.COMMENT_ADDED:
      await commentAddedConsumer(event);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

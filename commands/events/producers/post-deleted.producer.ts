import { Event, EventType } from "../../../shared/types";
import { publishEvent } from "./index";

export const publishPostDeleted = async (postId: number): Promise<void> => {
  const event: Event = {
    type: EventType.POST_DELETED,
    data: {
      id: postId,
    },
    timestamp: Date.now(),
  };

  await publishEvent(event);
};

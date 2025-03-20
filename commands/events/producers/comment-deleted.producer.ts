import { EventType, Event } from "../../../shared/types";
import { publishEvent } from "./index";

export const publishCommentDeleted = async (payload: {
  id: number;
  post_id: number;
}): Promise<void> => {
  const event: Event = {
    type: EventType.COMMENT_DELETED,
    data: {
      id: payload.id,
      post_id: payload.post_id,
    },
    timestamp: Date.now(),
  };

  await publishEvent(event);
};

import { Event, EventType, AddCommentCommand } from "../../../shared/types";
import { publishEvent } from "./index";

export const publishCommentAdded = async (
  comment_id: number,
  command: AddCommentCommand
) => {
  const event: Event = {
    type: EventType.COMMENT_ADDED,
    data: { id: comment_id, ...command.payload },
    timestamp: Date.now(),
  };

  await publishEvent(event);
};

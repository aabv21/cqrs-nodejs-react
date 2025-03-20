import { Event, EventType, CreatePostCommand } from "../../../shared/types";
import { publishEvent } from "./index";

export const publishPostCreated = async (
  post_id: number,
  command: CreatePostCommand
) => {
  const event: Event = {
    type: EventType.POST_CREATED,
    data: { id: post_id, ...command.payload },
    timestamp: Date.now(),
  };

  await publishEvent(event);
};

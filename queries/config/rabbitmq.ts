// RabbitMQ
import amqp from "amqplib";
import { handleEvent } from "../events/consumers";
import dotenv from "dotenv";

dotenv.config();

// RabbitMQ consumer setup
const setupEventConsumer = async () => {
  const connection = await amqp.connect(
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`
  );
  const channel = await connection.createChannel();
  await channel.assertExchange(process.env.RABBITMQ_EXCHANGE!, "fanout", {
    durable: false,
  });

  const { queue } = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue, process.env.RABBITMQ_EXCHANGE!, "");

  channel.consume(queue, async (msg) => {
    if (msg) {
      try {
        const event = JSON.parse(msg.content.toString());
        await handleEvent(event);
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message:", error);
        channel.ack(msg);
      }
    }
  });

  console.log("Event consumer setup completed");
};

export { setupEventConsumer };

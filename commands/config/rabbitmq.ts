import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

// RabbitMQ connection
let channel: amqp.Channel;
const setupRabbitMQ = async () => {
  const connection = await amqp.connect(
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`
  );
  channel = await connection.createChannel();
  await channel.assertExchange(process.env.RABBITMQ_EXCHANGE!, "fanout", {
    durable: false,
  });
};
setupRabbitMQ();

export { channel };

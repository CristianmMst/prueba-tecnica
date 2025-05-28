import amqp from "amqplib";
import { SERVICE } from "./types";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function start() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(SERVICE.INVENTORY_TO_DELIVERY);
  await channel.assertQueue(SERVICE.DELIVERY_TO_ORDER);

  console.log("Delivery service connected");

  channel.consume(SERVICE.INVENTORY_TO_DELIVERY, (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());
      console.log("Delivery received:", order);
      order.status = "SHIPPED";
      channel.sendToQueue(
        SERVICE.DELIVERY_TO_ORDER,
        Buffer.from(JSON.stringify(order)),
      );
      channel.ack(msg);
    }
  });
}

start();

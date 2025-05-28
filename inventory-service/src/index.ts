import amqp from "amqplib";
import { SERVICE } from "./types";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function start() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(SERVICE.ORDER_TO_INVENTORY);
  await channel.assertQueue(SERVICE.INVENTORY_TO_ORDER);
  await channel.assertQueue(SERVICE.INVENTORY_TO_DELIVERY);

  console.log("Inventory service connected");

  channel.consume(SERVICE.ORDER_TO_INVENTORY, (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());
      console.log("Inventory received:", order);
      const isValid = Math.random() > 0.3;

      const responseToOrder = {
        ...order,
        status: isValid ? "SUCCESS" : "ERROR",
        message: isValid ? "Stock disponible" : "No hay stock disponible",
      };

      channel.sendToQueue(
        SERVICE.INVENTORY_TO_ORDER,
        Buffer.from(JSON.stringify(responseToOrder)),
      );

      if (isValid) {
        channel.sendToQueue(
          SERVICE.INVENTORY_TO_DELIVERY,
          Buffer.from(JSON.stringify(order)),
        );
      }
      channel.ack(msg);
    }
  });
}

start();

import amqp from "amqplib";
import { SERVICE } from "../types";
import { deliveryStore, DeliveryOrder } from "../store";

export let channel: amqp.Channel;

export async function connect(url: string) {
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertQueue(SERVICE.ORDER_TO_INVENTORY);
  console.log("Order service connected");

  await channel.assertQueue(SERVICE.DELIVERY_TO_ORDER);
  await channel.assertQueue(SERVICE.INVENTORY_TO_ORDER);

  // Listen for inventory service
  channel.consume(SERVICE.INVENTORY_TO_ORDER, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log("Inventory received:", content);
      channel.ack(msg);
    }
  });

  // Listen for delivery service
  channel.consume(SERVICE.DELIVERY_TO_ORDER, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log("Delivery received:", content);

      const deliveryOrder: DeliveryOrder = {
        id: content.id,
        item: content.item,
        quantity: content.quantity,
        status: content.status,
        message: content.message,
      };

      deliveryStore.set(deliveryOrder.id, deliveryOrder);

      channel.ack(msg);
    }
  });
}

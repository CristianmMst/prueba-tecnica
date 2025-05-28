import { SERVICE } from "./types";
import { randomUUID } from "crypto";
import { deliveryStore } from "./store";
import express, { Request, Response } from "express";
import { channel, connect } from "./rabbitmq/connect";

const PORT = process.env.PORT || 3000;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

const app = express();

app.use(express.json());

app.post("/create_order", (req: Request, res: Response) => {
  const { item, quantity } = req.body;
  const order = {
    id: randomUUID().split("-").pop(),
    item,
    quantity,
  };

  channel.sendToQueue(
    SERVICE.ORDER_TO_INVENTORY,
    Buffer.from(JSON.stringify(order)),
  );
  res.status(201).json({ message: "Validando pedido", order });
});

app.get("/deliveries", (_: Request, res: Response) => {
  res.json(Array.from(deliveryStore.values()));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connect(RABBITMQ_URL);
});

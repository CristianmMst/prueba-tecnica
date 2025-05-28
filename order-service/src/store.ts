type DeliveryStatus = "PENDING" | "SHIPPED" | "ERROR";

export type DeliveryOrder = {
  id: string;
  item: string;
  quantity: number;
  message?: string;
  status: DeliveryStatus;
};

export const deliveryStore = new Map<string, DeliveryOrder>();

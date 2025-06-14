export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const ON_RAMP = "ON_RAMP";

export type MessageFromOrderBook =
  | {
      type: "DEPTH";
      payload: {
        market: string;
        bids: [string, string][];
        asks: [string, string][];
      };
    }
  | {
      type: "ORDER_PLACED";
      payload: {
        orderId: string;
        executedQty: number;
        fills: [
          {
            price: string;
            qty: number;
            tradeId: number;
          }
        ];
      };
    };

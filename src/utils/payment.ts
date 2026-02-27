import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
}

export type TypeResponseMidtrans = {
  token: string;
  redirect_url: string;
};

const createLink = async (payload: Payment): Promise<TypeResponseMidtrans> => {
  console.log("SERVER KEY:", MIDTRANS_SERVER_KEY);
  const result = await axios.post<TypeResponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}`, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
    },
  });
  if (result.status !== 201) {
    throw new Error("Failed to create payment link");
  }
  return result?.data;
};

export default { createLink };

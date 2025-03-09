import axios from "axios";
import type { Product, Sale } from "./types";
import type { Hex } from "viem";

export const Client = {
  client: axios.create({ baseURL: import.meta.env.VITE_CLIENT_URL }),

  async getProducts(merchant: Hex): Promise<Product[]> {
    try {
      const response = await this.client.get(`/products?merchant=${merchant}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getProduct(merchant: Hex, id: string): Promise<Product | null> {
    try {
      const response = await this.client.get(
        `/products/${id}?merchant=${merchant}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getSales(merchant: Hex): Promise<Sale[]> {
    try {
      const response = await this.client.get(`/sales?merchant=${merchant}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },
};

import axios from "axios";
import type { Product, Sale, CreateSale, Plan } from "./types";

export const Client = {
  client: axios.create({ baseURL: import.meta.env.VITE_CLIENT_URL }),

  async createSale(params: CreateSale): Promise<Sale | null> {
    try {
      const response = await this.client.post(`/sales/create`, params);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await this.client.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getPlan(id: string): Promise<Plan | null> {
    try {
      const response = await this.client.get(`/plans/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

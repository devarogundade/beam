import axios from "axios";
import type { Hex } from "viem";
import type { Product, Sale, CreateSale } from "./types";

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

  async getSales(merchant: Hex): Promise<Sale[]> {
    try {
      const response = await this.client.get(`/sales?merchant=${merchant}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },
};

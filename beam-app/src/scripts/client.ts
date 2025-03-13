import axios from "axios";
import type {
  ClientMerchant,
  CreateMerchant,
  CreateProduct,
  CreateSale,
  Product,
  Sale,
} from "./types";
import type { Hex } from "viem";

export const Client = {
  client: axios.create({ baseURL: import.meta.env.VITE_CLIENT_URL }),

  async getMerchant(merchant: Hex): Promise<ClientMerchant | null> {
    try {
      const response = await this.client.get(`/merchants/${merchant}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async createMerchant(params: CreateMerchant): Promise<ClientMerchant | null> {
    try {
      const response = await this.client.post(`/merchants/create`, params);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async createProduct(params: CreateProduct): Promise<Product | null> {
    try {
      const response = await this.client.post(`/products/create`, params);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async createSale(params: CreateSale): Promise<Product | null> {
    try {
      const response = await this.client.post(`/sales/create`, params);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getProducts(merchant: Hex): Promise<Product[]> {
    try {
      const response = await this.client.get(`/products?merchant=${merchant}`);
      return response.data;
    } catch (error) {
      return [];
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

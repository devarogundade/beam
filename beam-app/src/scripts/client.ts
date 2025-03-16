import axios from "axios";
import type {
  Chat,
  ClientMerchant,
  CreateMerchant,
  CreateProduct,
  UpdateWebhooks,
  CreatePlan,
  Product,
  Sale,
  Plan,
  TransactionType,
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

  async updateWebhooks(params: UpdateWebhooks): Promise<any> {
    try {
      const response = await this.client.post(
        `/merchants/update-webhooks`,
        params
      );
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

  async createPlan(params: CreatePlan): Promise<Plan | null> {
    try {
      const response = await this.client.post(`/plans/create`, params);
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

  async getPlans(merchant: Hex): Promise<Plan[]> {
    try {
      const response = await this.client.get(`/plans?merchant=${merchant}`);
      return response.data;
    } catch (error) {
      return [];
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

  async getSales(merchant: Hex, type: TransactionType): Promise<Sale[]> {
    try {
      const response = await this.client.get(
        `/sales?merchant=${merchant}&type=${type}`
      );
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async sendChat(merchant: Hex, text: string): Promise<boolean> {
    try {
      const response = await this.client.post(`/chat`, {
        merchant,
        message: text,
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  async getChats(merchant: Hex): Promise<Chat[]> {
    try {
      const response = await this.client.get(`/chats/${merchant}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },
};

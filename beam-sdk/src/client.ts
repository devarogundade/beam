import { BeamSDKOptions } from "./types";
import { Endpoints } from "./utils/endpoints";
import axios, { AxiosInstance } from "axios";

export class BeamClient {
  private client: AxiosInstance;

  constructor(options: BeamSDKOptions) {
    this.client = axios.create({
      baseURL: options.graphURL ? options.graphURL : Endpoints.BASE_GRAPH_URL,
    });
  }

  async request<T>(method: string, url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "API Error");
    }
  }
}

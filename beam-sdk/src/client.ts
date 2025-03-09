import { BeamSDKOptions } from "./types";
import { Endpoints } from "./utils/endpoints";
import axios, { AxiosInstance } from "axios";

export class BeamClient {
  private paymentURL: string;
  private graphClient: AxiosInstance;

  constructor(options: BeamSDKOptions) {
    this.paymentURL = options.paymentURL
      ? options.paymentURL
      : Endpoints.BASE_TRANSACTION_URL[options.network];

    this.graphClient = axios.create({
      baseURL: options.graphURL
        ? options.graphURL
        : Endpoints.BASE_GRAPH_URL[options.network],
    });
  }

  getTransactionURL(): string {
    return this.paymentURL;
  }

  async graphCall<T>(data?: any): Promise<T> {
    try {
      const response = await this.graphClient.request<T>({
        method: "POST",
        url: "/",
        data,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "API Error");
    }
  }
}

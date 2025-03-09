import { BeamClient } from "../client";
import { GetMerchant } from "../types";
import { Graph } from "../utils/graph";
import { Merchant } from "../types";

export abstract class BaseMerchant {
  protected readonly graph: Graph;
  protected readonly basePath: string = "/";

  constructor(client: BeamClient) {
    this.graph = new Graph(client);
  }

  getMerchant(params: GetMerchant): Promise<Merchant | null> {
    return this.graph.getMerchant(params.merchant);
  }
}

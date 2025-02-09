"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamClient = void 0;
const endpoints_1 = require("./utils/endpoints");
const axios_1 = require("axios");
class BeamClient {
    constructor(options) {
        this.client = axios_1.default.create({
            baseURL: options.graphURL ? options.graphURL : endpoints_1.Endpoints.BASE_GRAPH_URL,
        });
    }
    async request(method, url, data) {
        try {
            const response = await this.client.request({
                method,
                url,
                data,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || "API Error");
        }
    }
}
exports.BeamClient = BeamClient;
//# sourceMappingURL=client.js.map
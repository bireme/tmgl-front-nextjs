import axios, { AxiosInstance } from "axios";

export abstract class BaseUnauthenticatedApi {
  protected _api: AxiosInstance;

  public constructor(endpoint: string) {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error("env variable NEXT_PUBLIC_API_BASE_URL not set");
    }
    this._api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
    });
    this._api.defaults.headers.common["Accept"] = "*/*";
  }
}

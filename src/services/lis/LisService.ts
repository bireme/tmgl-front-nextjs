import { LisApiResponse, LisDocuments } from "../types/lisTypes";

import axios from "axios";

export interface queryType {
  parameter: string;
  query: string;
}
export class LisService {
  public getResources = async (
    resource: string,
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    lang?: string
  ): Promise<LisApiResponse> => {
    let query = undefined;
    let q = undefined;
    if (resource != "all" || queryItems) {
      query = `${resource != "all" ? `thematic_area:"${resource}` : ""}"${
        queryItems
          ? queryItems
              .map((k) => {
                return `${k.parameter}:"${k.query}"`;
              })
              .join("&")
          : ""
      }`;
      q = "AND";
    }

    const { data } = await axios.post<LisApiResponse>("/api/lis", {
      query,
      count,
      start,
      q,
    });
    return data;
  };

  public getItem = async (id: string) => {
    const query = `id:"${id}"`;
    const { data } = await axios.post<LisApiResponse>("/api/lis", {
      query,
      q: "AND",
    });
    return data;
  };
}

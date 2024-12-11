import { LisApiResponse, LisDocuments } from "../types/lisTypes";

import axios from "axios";

export class LisService {
  public getResources = async (
    resource: string,
    count: number,
    start: number,
    lang?: string
  ): Promise<LisApiResponse> => {
    let query = `thematic_area:"${resource}"`;
    let q = "AND";
    const { data } = await axios.post<LisApiResponse>("/api/lis", {
      query,
      count,
      start,
      q,
    });
    return data;
  };
}

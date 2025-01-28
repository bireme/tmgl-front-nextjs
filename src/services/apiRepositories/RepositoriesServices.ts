import { LisDocuments, RepositoryApiResponse } from "../types/RepositoryTypes";

import axios from "axios";
import { queryType } from "../types/resources";

export class RepositoriesServices {
  public getResources = async (
    thematic_area: string,
    count: number,
    start: number,
    repository: string,
    queryItems?: Array<queryType>,
    lang?: string
  ): Promise<RepositoryApiResponse> => {
    let query = undefined;
    let q = undefined;
    if (thematic_area != "all" || queryItems) {
      query = `${
        thematic_area != "all" ? `thematic_area:"${thematic_area}` : ""
      }"${
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

    const { data } = await axios.post<RepositoryApiResponse>(
      `/api/${repository}`,
      {
        query,
        count,
        start,
        q,
      }
    );
    return data;
  };

  public getItem = async (id: string, repository: string) => {
    const query = `id:"${id}"`;
    const { data } = await axios.post<RepositoryApiResponse>(
      `/api/${repository}`,
      {
        query,
        q: "AND",
      }
    );
    return data;
  };
}

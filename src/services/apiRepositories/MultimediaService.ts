import {
  MultimediaDiaServerResponse,
  MultimediaObject,
  MultimediaResponse,
  MultimediaResponseItems,
} from "../types/multimediaTypes";

import axios from "axios";

export class MultimediaService {
  public getResources = async (
    lang: string,
    filterType?: string,
    filter?: string
  ): Promise<MultimediaDiaServerResponse | undefined> => {
    try {
      const response = await axios.post<MultimediaResponse>(`/api/multimedia`, {
        fq: filterType,
        q: filter,
        lang,
      });
      let returnObj = response.data.data.diaServerResponse[0];

      for (let i = 0; i < returnObj.response.docs.length; i++) {
        let thumbnail = await this.getVideoThumbnail(
          returnObj.response.docs[i]
        );
        returnObj.response.docs[i].thumbnail = thumbnail;
      }
      returnObj.response.docs = returnObj.response.docs.reverse();
      return returnObj;
    } catch (error) {
      console.log(error);
    }
  };

  public getItem = async (
    id: string,
    lang: string
  ): Promise<MultimediaResponse> => {
    const response = await axios.post<MultimediaResponse>(`/api/multimedia`, {
      id,
      lang,
    });
    return response.data;
  };

  public getVideoThumbnail = async (obj: MultimediaObject): Promise<string> => {
    let videoId: string;
    if (obj.link[0].includes("vimeo")) {
      videoId = obj.link[0].split("vimeo.com/")[1];
      const vimeoProps = await axios.get(
        `https://vimeo.com/api/v2/video/${videoId}.json`
      );
      return vimeoProps.data[0].thumbnail_large;
    }
    if (obj.link[0].includes("youtube")) {
      videoId = obj.link[0].split("v=")[1];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "/local/jpeg/multimedia.jpg";
  };
}

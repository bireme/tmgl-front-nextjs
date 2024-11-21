import { DireveApiResponse } from "../types/direveTypes";
import { EventInterface } from "../types/eventInterface";
import axios from "axios";

export class DireveService {
  public getEvents = async (
    lang: string,
    count: number,
    query?: string
  ): Promise<EventInterface[]> => {
    try {
      const { data } = await axios.post("/api/direve", {
        query,
        lang,
        count,
      });

      return data.data.diaServerResponse[0].response.docs.map((event: any) => {
        return {
          title: event.title,
          description: event.observations,
          location: event.location,
          date: event.date,
          links: [
            {
              label: "Event Link",
              url: event.link,
            },
          ],
        };
      });
    } catch (error) {
      console.error("Error while searching events:", error);
      throw new Error("Error while searching events");
    }
  };
}

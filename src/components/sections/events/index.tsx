import { Button, Container, Flex, Loader } from "@mantine/core";
import { EventInterface, EventLink } from "@/services/types/eventInterface";
import { IconArrowRight, IconBrandYoutube } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { AcfEvents } from "@/services/types/homeAcf.dto";
import { DireveService } from "@/services/direve/direveService";
import styles from "../../../styles/components/sections.module.scss";

export const EventsSection = ({ background }: AcfEvents) => {
  const eventImage = "/local/png/img-events.png";
  const [events, setEvents] = useState<EventInterface[]>([]);
  const _direveService = new DireveService();

  const getEvents = async () => {
    const events = await _direveService.getEvents("eng", 1);
    setEvents(events);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div
      className={styles.EventsSection}
      style={{
        backgroundImage: `linear-gradient(90deg, rgb(5 29 97 / 88%) 5.19%, rgba(12, 43, 100, 0) 100%), url('${
          background ? background?.url : eventImage
        }')`,
      }}
    >
      <Container size={"xl"} py={80}>
        {events.length > 0 ? (
          <Flex
            direction={"column"}
            justify={"space-between"}
            className={styles.EventsContent}
          >
            <div>
              <h2>{events[0].title}</h2>
              <p>{events[0].description}</p>
              <Flex direction={{ base: "column", md: "row" }} gap={15}>
                {events[0].links?.map((link: EventLink, key: number) => {
                  return (
                    <a key={key} href={link.url} target="_blank">
                      <Button>{link.label} </Button>
                    </a>
                  );
                })}
              </Flex>
            </div>
            <div>
              <a
                href={"/events"}
                style={{ color: "white", textDecoration: "none" }}
              >
                <Flex mt={25} gap={10} align={"center"}>
                  Explore all events{" "}
                  <Button size={"xs"} p={5}>
                    <IconArrowRight stroke={1} />
                  </Button>
                </Flex>
              </a>
            </div>
          </Flex>
        ) : (
          <Loader />
        )}
      </Container>
    </div>
  );
};

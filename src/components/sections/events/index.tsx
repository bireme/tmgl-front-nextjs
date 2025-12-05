import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import { IconArrowRight, IconBrandYoutube } from "@tabler/icons-react";
import { decodeHtmlEntities, removeHtmlTags } from "@/helpers/stringhelper";
import { useCallback, useEffect, useState } from "react";

import { AcfEvents } from "@/services/types/homeAcf.dto";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

interface EventsSectionProps {
  region?: string;
  excludedTagIds?: number[];
}

export const EventsSection = ({ region, excludedTagIds }: EventsSectionProps) => {
  //DefaultImage if event has no image
  const eventImage = "/local/png/img-events.png";
  const router = useRouter();
  const [event, setEvent] = useState<Post>();
  const _api = new PostsApi(region);

  const getEvents = useCallback(async () => {
    let api = new PostsApi();
    if (region) api = new PostsApi(region);
    try {
      // Preparar opções de exclusão de tags
      let tagOptions: any = {};
      
      // Se excludedTagIds for fornecido, adicionar essas tags à exclusão
      if (excludedTagIds && excludedTagIds.length > 0) {
        tagOptions.tagId = excludedTagIds;
        tagOptions.excludeTag = true;
      }
      
      const resp = await api.getCustomPost(
        "event",
        10,
        undefined,
        undefined,
        region,
        Object.keys(tagOptions).length > 0 ? tagOptions : undefined
      );
      if (resp.length > 0) {
        setEvent(resp[0]);
      }
    } catch (error) {}
  }, [region, excludedTagIds]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return event ? (
    <>
      <div
        className={styles.EventsSection}
        style={{
          backgroundImage: `linear-gradient(90deg, rgb(5 29 97 / 88%) 5.19%, rgba(12, 43, 100, 0) 100%), url('${
            _api.findFeaturedMedia(event, "full")
              ? _api.findFeaturedMedia(event, "full")
              : _api.findFeaturedMedia(event, "full")
          }')`,
        }}
      >
        <div>
          <Flex py={80} px={'12%'}>
            <Flex
              direction={"column"}
              justify={"space-between"}
              className={styles.EventsContent}
            >
              <div>
                <h2>{event?.title.rendered}</h2>
                <p>
                  {removeHtmlTags(
                    event?.excerpt?.rendered ? event?.excerpt?.rendered : ""
                  )}
                </p>
                <Flex direction={{ base: "column", md: "row" }} gap={15}>
                  
                  {event?.acf?.releated_content ? (
                    event?.acf?.releated_content.map((item: any, key: number) => (
                      <a
                        key={key}
                        style={{ color: "white", textDecoration: "none" }}
                        target="_blank"
                        href={item.type == "Link" ? item.link : item.file}
                      >
                        <Button>{item.label}</Button>
                      </a>
                    ))
                  ) : (
                    <></>
                  )}
                </Flex>
              </div>
              <div>
                <Flex
                  mt={25}
                  gap={10}
                  align={"center"}
                  onClick={() => {
                    router.push("/events");
                  }}
                  component="a"
                  style={{ cursor: "pointer" }}
                >
                  Explore all events{" "}
                  <Button size={"xs"} p={5}>
                    <IconArrowRight stroke={1} />
                  </Button>
                </Flex>
              </div>
            </Flex>
          </Flex>
          </div>
      </div>
    </>
  ) : (
    <></>
  );
};

import { BackgroundImage, Button, Container, Flex, Group } from "@mantine/core";
import { IconArrowRight, IconBrandYoutube } from "@tabler/icons-react";
import { decodeHtmlEntities, removeHtmlTags } from "@/helpers/stringhelper";

import { AcfEvents } from "@/services/types/homeAcf.dto";
import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export const EventsSection = ({
  title,
  subtitle,
  webcast,
  meeting,
  repport,
  background,
}: AcfEvents) => {
  const eventImage = "/local/png/img-events.png";
  const router = useRouter();
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
        <Flex
          direction={"column"}
          justify={"space-between"}
          className={styles.EventsContent}
        >
          <div>
            <h2>{title}</h2>
            <p>{removeHtmlTags(subtitle ? subtitle : "")}</p>
            <Flex direction={{ base: "column", md: "row" }} gap={15}>
              <a href={webcast} target="_blank">
                <Button>
                  Webcasts <IconBrandYoutube style={{ marginLeft: "10px" }} />
                </Button>
              </a>
              <a href={meeting} target="_blank">
                <Button>Meeting Reports</Button>
              </a>
              <a href={repport} target="_blank">
                <Button>Concept Notes</Button>
              </a>
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
      </Container>
    </div>
  );
};

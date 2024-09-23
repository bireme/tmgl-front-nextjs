import { Button, Container, Flex, Group } from "@mantine/core";
import { IconArrowRight, IconBrandYoutube } from "@tabler/icons-react";

import styles from "../../../styles/components/sections.module.scss";

export const EventsSection = ({
  title,
  subtitle,
  webcast,
  meeting,
  repport,
}: AcfEvents) => {
  const eventImage = "/local/png/img-events.png";
  return (
    <div
      className={styles.EventsSection}
      style={{
        backgroundImage: `linear-gradient(90deg, rgb(5 29 97 / 88%) 5.19%, rgba(12, 43, 100, 0) 100%), url(${eventImage})`,
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
            <p>{subtitle}</p>
            <Group>
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
            </Group>
          </div>
          <div>
            <Flex gap={10} align={"center"}>
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

import { Button, Container, Flex, Group } from "@mantine/core";
import { IconArrowRight, IconBrandYoutube } from "@tabler/icons-react";

import styles from "../../../styles/components/sections.module.scss";

export const EventsSection = () => {
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
            <h2>WHO Traditional Medicine Global Summit</h2>
            <p>
              The first WHO Traditional Medicine Global Summit looked anew at
              the vast potential and applications of traditional medicine amidst
              important challenges and opportunities to achieve universal health
              coverage and well-being for people and the planet.
            </p>
            <Group>
              <Button>
                Webcasts <IconBrandYoutube style={{ marginLeft: "10px" }} />
              </Button>
              <Button>Meeting Reports</Button>
              <Button>Concept Notes</Button>
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

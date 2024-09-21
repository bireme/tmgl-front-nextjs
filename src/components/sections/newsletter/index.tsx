import { Button, Container, Flex, Grid, Group, Input } from "@mantine/core";

import styles from "../../../styles/components/sections.module.scss";

export const NewsletterSection = () => {
  return (
    <div className={styles.NewsletterSection}>
      <Container size={"xl"}>
        <Flex justify={"flex-start"} align={"center"}>
          <form>
            <h4>Subscribe to the TMGL Bulletin</h4>
            <h5>
              TCIM news, events, opportunities and updates, monthly in your
              inbox
            </h5>
            <Group gap={"10px"} style={{ width: "100%" }}>
              <Input style={{ width: "40%" }} />
              <Button>Subscribe</Button>
            </Group>
          </form>
        </Flex>
      </Container>
      <div
        className={styles.NewsImageBg}
        style={{ backgroundImage: `url(/local/png/img-newsletter.png)` }}
      />
    </div>
  );
};

import { Button, Container, Grid, Group, Input } from "@mantine/core";

import styles from "../../../styles/components/sections.module.scss";

export const NewsletterSection = () => {
  return (
    <div className={styles.NewsletterSection}>
      <Container size={"xl"}>
        <Grid>
          <Grid.Col span={{ md: 8 }} py={60}>
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
          </Grid.Col>
          <Grid.Col span={{ md: 4 }} p={0}>
            <div className={styles.NewsImageBg} />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

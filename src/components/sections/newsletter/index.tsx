import { Button, Container, Flex, Grid, Group, Input } from "@mantine/core";

import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export const NewsletterSection = () => {
  const router = useRouter();
  return (
    <div className={styles.NewsletterSection}>
      <Container size={"xl"}>
        <Flex justify={"flex-start"} align={"center"}>
          <form>
            <h4>Join the TMGL Community</h4>
            <h5>
              TCIM news, events, opportunities and updates, monthly in your
              inbox
            </h5>
            <Flex gap={"10px"} style={{ width: "100%" }}>
              <Input style={{ width: "30%" }} size={"md"} />
              <Button
                onClick={() => {
                  router.push("/subscription");
                }}
                size={"md"}
              >
                Subscribe
              </Button>
            </Flex>
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

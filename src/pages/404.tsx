/* eslint-disable react/no-unescaped-entities */

import { Button, Container, Flex, Grid } from "@mantine/core";

import Link from "next/link";
import styles from "../styles/pages/pages.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <Container size={"xl"} py={150}>
      <Grid className={styles.NotFoundPage}>
        <Grid.Col span={{ base: 12, md: 6.5 }}>
          <img src={"/local/svg/404.svg"} width={"100%"} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5.5 }}>
          <p>
            <b>Error 404</b>
          </p>
          <p>
            That's embarrassing... We couldn't find the page you're looking for.
            But don't worry, you can go to the homepage to browse TMGL or do a
            new search.
          </p>
          <Flex gap={20}>
            <Link href={"/"}>
              <Button size={"lg"}> TMGL Homepage </Button>
            </Link>
            <Link href={"/"}>
              <Button size={"lg"} className={styles.tmgl_secondary_button}>
                {" "}
                Contact Us{" "}
              </Button>
            </Link>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

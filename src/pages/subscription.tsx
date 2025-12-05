/* eslint-disable react/no-unescaped-entities */
import { Button, Container, Flex, Grid } from "@mantine/core";

import Head from "next/head";
import Link from "next/link";
import styles from "../styles/pages/pages.module.scss";

export default function Subscription() {
  return (
    <>
      <Head>
        <title>Subscription Confirmed - The WHO Traditional Medicine Global Library</title>
      </Head>
      <Container size={"xl"} py={150}>
      <Grid className={styles.NotFoundPage}>
        <Grid.Col span={{ base: 12, md: 6.5 }}>
          <img src={"/local/svg/subscription.svg"} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5.5 }}>
          <p>
            <b>Thanks for your subscription!</b>
          </p>
          <p>
            Thank you for subscribing to our bulletin! Now you will receive the
            most relevant news about Traditional Medicine in your email. Don't
            forget to check the confirmation message.
          </p>
          <Flex gap={20}>
            <Link href={"/"}>
              <Button size={"lg"}> TMGL Homepage </Button>
            </Link>
            <Link href={"/news"}>
              <Button size={"lg"}>TMGL News </Button>
            </Link>
          </Flex>
        </Grid.Col>
      </Grid>
      </Container>
    </>
  );
}

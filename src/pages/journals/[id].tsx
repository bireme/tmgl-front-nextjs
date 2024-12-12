import { Container, Flex, Grid } from "@mantine/core";
import { useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { LisDocuments } from "@/services/types/RepositoryTypes";
import { RepositoriesServices } from "@/services/apiRepositories/RepositoriesServices";
import pageStyles from "../../styles/pages/pages.module.scss";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function Journal() {
  const router = useRouter();
  const [item, setItem] = useState<LisDocuments>();
  const {
    query: { id },
  } = router;
  const _service = new RepositoriesServices();

  const getItem = async () => {
    try {
      if (id) {
        const response = await _service.getItem(id.toString(), "journals");
        setItem(response.data.diaServerResponse[0]?.response.docs[0]);
      }
    } catch (e) {
      console.log("Error while trying to get Evidence Map");
    }
  };

  useEffect(() => {
    getItem();
  }, [id]);

  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/journals", name: "Journals" },
            { path: `/${id}`, name: `${item?.title}` },
          ]}
        />
        <br />
        <br />
        <h5
          className={`${styles.TitleWithIcon} ${styles.small}`}
          style={{ margin: "5px" }}
        >
          <img src={"/local/svg/simbol.svg"} />
          Journals
        </h5>
        <Grid mt={30} mb={30}>
          <Grid.Col span={{ base: 12, md: 3.5 }} pr={{ md: 15 }}>
            <img src={"/local/jpeg/journal.jpeg"} width={"100%"} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8.5 }} pl={{ md: 10 }}>
            <Flex
              direction={"column"}
              className={pageStyles.JournalTitleContent}
            >
              <h1>{item?.title}</h1>
              <p>{item?.abstract}</p>
            </Flex>
          </Grid.Col>
        </Grid>
        <h4 className={`${styles.BlueTitle} ${styles.small}`}>
          Journal Details
        </h4>
        <Grid className={pageStyles.JournalDetails}>
          <Grid.Col span={{ base: 12, md: 4 }} pr={{ md: 15 }}>
            <p>
              <b>URL</b>
            </p>
            <p>
              {item?.link.map((link, k) => {
                return (
                  <a href={link} key={k}>
                    {link}
                  </a>
                );
              })}
            </p>
            <p>
              <b>ISSN</b>
            </p>
            <p>
              <b>Language</b>
            </p>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }} pl={{ md: 10 }}></Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

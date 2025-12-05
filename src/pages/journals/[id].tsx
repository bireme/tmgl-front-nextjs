import { Badge, Container, Divider, Flex, Grid } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { JournalItemDto } from "@/services/types/journalsDto";
import { JournalsService } from "@/services/apiRepositories/JournalsService";
import { ShareModal } from "@/components/share";
import { TagItem } from "@/components/feed/resourceitem";
import pageStyles from "../../styles/pages/pages.module.scss";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function Journal() {
  const router = useRouter();
  const [item, setItem] = useState<JournalItemDto>();
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const {
    query: { id },
  } = router;
  const [openShareModal, setOpenShareModal] = useState(false);
  const _service = new JournalsService();
  const { language } = useContext(GlobalContext);
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const tagColors = {
    country: "#54831B",
    descriptor: "#8B142A",
    region: "#3F6114",
  };
  const getItem = async () => {
    try {
      if (id) {
        const response = await _service.getItem(id.toString());
        setItem(response);
        setTags(_service.formatTags(response, language));
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    if (window) {
      setFullUrl(window.location.href);
    }
    getItem();
  }, [id]);

  return (
    <>
      <Head>
        <title>{item?.title ? `${item.title} - ` : ''}The WHO Traditional Medicine Global Library</title>
      </Head>
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
        <Grid>
          <Grid.Col pr={{ md: 30 }} span={{ md: 9, xs: 12, base: 12 }}>
            <p
              className={`${styles.CategoryLabel} ${styles.small}`}
              style={{ margin: "5px" }}
            >
              Journals
            </p>
            <Grid mt={30} mb={0}>
              {item?.logo ? (
                <>
                  <Grid.Col span={{ base: 12, md: 3.5 }} pr={{ md: 15 }}>
                    <img src={"/local/jpeg/journal.jpeg"} width={"100%"} />
                  </Grid.Col>
                </>
              ) : (
                <></>
              )}

              <Grid.Col
                span={{ base: 12, md: item?.logo ? 8.5 : 12 }}
                pl={{ md: 10 }}
              >
                <Flex
                  direction={"column"}
                  className={pageStyles.JournalTitleContent}
                >
                  <h1>{item?.title}</h1>
                  <p>
                    {
                      item?.description?.find((d) => d.lang == language)
                        ?.content
                    }
                  </p>
                </Flex>
              </Grid.Col>
            </Grid>
            <Flex wrap={"wrap"} gap={5} mb={40} className={styles.Tags}>
              {tags
                ?.filter((tag) => tag.type == "descriptor")
                .map((tag) => (
                  <Badge
                    size={"lg"}
                    key={tag.name}
                    style={{ cursor: "pointer" }}
                    color={tagColors.descriptor}
                    onClick={() =>
                      router.push(`/journals?thematicArea=${tag.name}`)
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
              {tags
                ?.filter((tag) => tag.type == "region")
                .map((tag) => (
                  <Badge
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/journals?region=${tag.name}`)}
                    size={"lg"}
                    key={tag.name}
                    color={tagColors.region}
                  >
                    {tag.name}
                  </Badge>
                ))}
              {tags
                ?.filter((tag) => tag.type == "country")
                .map((tag) => (
                  <Badge
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/journals?country=${tag.name}`)}
                    size={"lg"}
                    key={tag.name}
                    color={tagColors.country}
                  >
                    {tag.name}
                  </Badge>
                ))}
            </Flex>
          </Grid.Col>
          <Grid.Col pt={{ md: 65 }} span={{ md: 3, sm: 12, base: 12 }}>
            <h2 className={`${styles.BlueTitle} ${styles.small}`}>
              Journal Details
            </h2>
            <Grid className={pageStyles.JournalDetails} mt={-40}>
              <Grid.Col span={{ base: 12, md: 12 }} pr={{ md: 15 }}>
                <p>
                  <b>URL</b>
                </p>

                {item?.links?.map((link, k) => {
                  return (
                    <p key={k} className={pageStyles.JournalDetail}>
                      <a href={link} target="_blank">
                        {link}
                      </a>
                    </p>
                  );
                })}

                <p>
                  <b>ISSN</b>
                </p>
                <p className={pageStyles.JournalDetail}>{item?.issn}</p>
                {item?.language ? (
                  <>
                    <p>
                      <b>Language</b>
                    </p>
                    <p className={pageStyles.JournalDetail}>
                      {item?.language
                        ? item.language.find((i) => i.lang == language)?.content
                        : ""}
                    </p>{" "}
                  </>
                ) : (
                  <></>
                )}
                {item?.coverage ? (
                  <p>
                    <b>Coverage</b>
                  </p>
                ) : (
                  <></>
                )}
                {item?.coverage ? (
                  <p className={pageStyles.JournalDetail}>{item?.coverage}</p>
                ) : (
                  <></>
                )}

                <p>
                  <b>Responsibility Mention</b>
                </p>
                {item?.responsibility_mention ? (
                  <p className={pageStyles.JournalDetail}>
                    {item?.responsibility_mention}
                  </p>
                ) : (
                  <></>
                )}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }} pl={{ md: 10 }}></Grid.Col>
            </Grid>
            <Flex
              className={pageStyles.functions}
              mb={20}
              gap={20}
              align={"flex-end"}
              justify={"flex-end"}
            >
              <Flex
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpenShareModal(true);
                }}
                gap={5}
              >
                <IconShare /> Share
              </Flex>
              <Flex
                style={{ cursor: "pointer" }}
                onClick={() => {
                  () => window.print();
                }}
                gap={5}
              >
                <IconPrinter /> Print
              </Flex>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        link={fullUrl ? fullUrl : ""}
      />
    </>
  );
}

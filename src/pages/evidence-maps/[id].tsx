import { Badge, Container, Flex, Grid } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import moment, { lang } from "moment";
import { useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { EvidenceMapItemDto } from "@/services/types/evidenceMapsDto";
import { EvidenceMapsService } from "@/services/apiRepositories/EvidenceMapsService";
import { GlobalContext } from "@/contexts/globalContext";
import { ShareModal } from "@/components/share";
import { TableauEmbed } from "@stoddabr/react-tableau-embed-live";
import { TagItem } from "@/components/feed/resourceitem";
import pageStyles from "../../styles/pages/pages.module.scss";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function EvidenceMap() {
  const router = useRouter();
  const [item, setItem] = useState<EvidenceMapItemDto>();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const { language } = useContext(GlobalContext);
  const {
    query: { id },
  } = router;
  const _service = new EvidenceMapsService();
  const tagColors = {
    country: "#69A221",
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
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/evidence-maps", name: "Evidence Maps" },
            { path: `/${id}`, name: `${item?.title}` },
          ]}
        />
        <br />
        <br />
        <Grid>
          <Grid.Col pr={{ md: 30 }} span={{ md: 9, xs: 12, base: 12 }}>
            <h5
              className={`${styles.TitleWithIcon} ${styles.small}`}
              style={{ margin: "5px" }}
            >
              Evidence Maps
            </h5>
            <h3 className={`${styles.BlueTitle}`}>{item?.title}</h3>
            <p className={`${styles.Description}`}>{item?.excerpt}</p>
            <Flex
              className={styles.CatAndFunctions}
              direction={"row"}
              align={"center"}
              justify={"space-between"}
              py={20}
              mb={10}
            >
              <div>
                <Flex wrap={"wrap"} gap={5} className={styles.Tags}>
                  {tags
                    ?.filter((tag) => tag.type == "descriptor")
                    .map((tag) => (
                      <Badge
                        size={"lg"}
                        key={tag.name}
                        style={{ cursor: "pointer" }}
                        color={tagColors.descriptor}
                        onClick={() =>
                          router.push(`/evidence-maps?thematicArea=${tag.name}`)
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
                        onClick={() =>
                          router.push(`/evidence-maps?region=${tag.name}`)
                        }
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
                        onClick={() =>
                          router.push(`/evidence-maps?country=${tag.name}`)
                        }
                        size={"lg"}
                        key={tag.name}
                        color={tagColors.country}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </Flex>
              </div>
              <Flex className={pageStyles.functions} mb={20} gap={20}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenShareModal(true);
                  }}
                >
                  <IconShare /> Share
                </span>
              </Flex>
            </Flex>
          </Grid.Col>
          <Grid.Col pt={{ md: 60 }} span={{ md: 3, xs: 12, base: 12 }}>
            <div className={pageStyles.MapDetails}>
              <h5>Map Details</h5>
              {item?.releatedDocuments ? (
                <>
                  <p>
                    <b>Related Documents</b>
                  </p>
                  {item?.releatedDocuments?.map((doc, key) => (
                    <p key={key}>
                      <a
                        className={pageStyles.RelatedDocuments}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {doc.label}
                      </a>
                    </p>
                  ))}
                  <hr />
                </>
              ) : (
                <></>
              )}

              <p>
                <b>Publication Date</b>
                <br />
                {moment(item?.created_at, "YYYYMMDD").format("MMM DD, YYYY")}
              </p>
              <p>
                <b>Last Update</b>
                <br />
                {moment(item?.updated_at, "YYYYMMDD").format("MMM DD, YYYY")}
              </p>
            </div>
          </Grid.Col>
        </Grid>
        <hr />
        <div
          className="App"
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {item?.links && _service.getTableauVixLink(item.links) ? (
            <TableauEmbed sourceUrl={_service.getTableauVixLink(item.links)} />
          ) : item?.links ? (
            <>
              {item.links.map((link: any, key) => (
                <iframe
                  src={link}
                  key={key}
                  style={{ marginBottom: "40px" }}
                  width={"100%"}
                  frameBorder={0}
                  height={"1050px"}
                />
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        link={fullUrl ? fullUrl : ""}
      />
    </>
  );
}

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
        setItem(response.data[0]);
        setTags(_service.formatTags(response.data[0], language));
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
            { path: "/evidence-maps", name: "Evidence Maps" },
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
          Evidence Maps Platform
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
                    color={tagColors.descriptor}
                  >
                    {tag.name}
                  </Badge>
                ))}
              {tags
                ?.filter((tag) => tag.type == "region")
                .map((tag) => (
                  <Badge size={"lg"} key={tag.name} color={tagColors.region}>
                    {tag.name}
                  </Badge>
                ))}
              {tags
                ?.filter((tag) => tag.type == "country")
                .map((tag) => (
                  <Badge size={"lg"} key={tag.name} color={tagColors.country}>
                    {tag.name}
                  </Badge>
                ))}
            </Flex>
          </div>
          <Flex className={pageStyles.functions} mb={20} gap={20}>
            <span
              onClick={() => {
                setOpenShareModal(true);
              }}
            >
              <IconShare /> Share
            </span>
            <span onClick={() => window.print()}>
              <IconPrinter /> Print
            </span>
          </Flex>
        </Flex>
        <hr />
        <Grid mt={40}>
          <Grid.Col span={{ md: 9.5, base: 12 }}>
            <div
              className="App"
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {item?.links ? (
                <TableauEmbed
                  sourceUrl={_service.getTableauVixLink(item.links)}
                />
              ) : (
                <></>
              )}
            </div>
          </Grid.Col>
          <Grid.Col span={{ md: 2.5, base: 12 }}>
            <div className={pageStyles.MapDetails}>
              <h5>Map Details</h5>
              {/* <p>
                <b>Related Documents</b>
              </p> */}
              <hr />
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
      </Container>
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        link={fullUrl ? fullUrl : ""}
      />
    </>
  );
}

import { Container, Flex, Grid } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { LisDocuments } from "@/services/types/lisTypes";
import { LisService } from "@/services/lis/LisService";
import { ShareModal } from "@/components/share";
import moment from "moment";
import pageStyles from "../../styles/pages/pages.module.scss";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function EvidenceMap() {
  const router = useRouter();
  const [item, setItem] = useState<LisDocuments>();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const {
    query: { id },
  } = router;
  const _service = new LisService();

  const getItem = async () => {
    try {
      if (id) {
        const response = await _service.getItem(id.toString());
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
        <p className={`${styles.Description}`}>{item?.abstract}</p>
        <Flex
          className={styles.CatAndFunctions}
          direction={"row"}
          align={"center"}
          justify={"space-between"}
          py={20}
          mb={10}
        >
          <div></div>
          <Flex className={pageStyles.functions} gap={20}>
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
        <Grid>
          <Grid.Col span={{ md: 9.5, base: 12 }}>
            <iframe
              src={item?.link[0]}
              width={"100%"}
              height={"70vh"}
              style={{ float: "left" }}
            />
          </Grid.Col>
          <Grid.Col span={{ md: 2.5, base: 12 }}>
            <div className={pageStyles.MapDetails}>
              <h5>Map Details</h5>
              <p>
                <b>Related Documents</b>
              </p>
              <hr />
              <p>
                <b>Publication Date</b>
              </p>
              <p>
                {moment(item?.created_date, "YYYYMMDD").format("MMM DD, YYYY")}
              </p>
              <p>
                <b>Last Update</b>
              </p>
              <p>
                {moment(item?.updated_date, "YYYYMMDD").format("MMM DD, YYYY")}
              </p>
              {/* <p>
                <b>Visualizations</b>
              </p>
              <p></p> */}
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

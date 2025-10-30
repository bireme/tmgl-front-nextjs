import { Button, Container, Flex, Grid } from "@mantine/core";

import Cookies from "js-cookie";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { TraditionalSectionCard } from "..";
import { cookies } from "next/headers";
import styles from "../../../styles/components/sections.module.scss";

export interface RegionalDimensionsProps {
  region: string;
  acf: HomeAcf;
}

export const RegionalDimensions = ({
  region,
  acf,
}: RegionalDimensionsProps) => {
  const _lang = Cookies.get("lang");
  return (
    <div
      className={styles.RegionalDimensions}
      style={{ backgroundImage: `url(${acf.tmd.background_image.url})` }}
    >
      <Container size={"xl"} py={60}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4.5 }}>
            <h2 className={styles.TitleWithIcon}>{acf.tmd.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: acf.tmd.subtitle }} />
            {/* {acf.tmd?.explore_page ? (
              <>
                <a
                  href={`${region}/content/${acf.tmd?.explore_page.post_name}${
                    _lang ? `?lang=${_lang}` : ""
                  }`}
                >
                  <Button style={{ fontWeight: 400 }} mt={20}>
                    Explore the content
                  </Button>
                </a>
              </>
            ) : (
              <> </>
            )} */}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7.5 }} px={20}>
            <Flex
              direction={"row"}
              wrap={"wrap"}
              gap={20}
              justify={"space-evenly"}
              align={"center"}
              mt={60}
            >
              {acf.tmd?.dimensions?.map((dimension: any, key: number) => {
                return (
                  <TraditionalSectionCard
                    key={key}
                    sm={true}
                    iconPath={dimension.icon.url}
                    target={dimension.global_slug.includes("https") || dimension.global_slug.includes("http") ? dimension.global_slug : `${region ? "/" + region : ""}/dimensions/${
                      dimension.global_slug
                    }`}
                    title={dimension.title}
                  />
                );
              })}
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

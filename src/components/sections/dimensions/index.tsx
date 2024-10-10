import { Button, Container, Flex, Grid } from "@mantine/core";

import { HomeAcf } from "@/services/types/homeAcf.dto";
import { TraditionalSectionCard } from "..";
import styles from "../../../styles/components/sections.module.scss";

export interface RegionalDimensionsProps {
  region: string;
  acf: HomeAcf;
}

export const RegionalDimensions = ({
  region,
  acf,
}: RegionalDimensionsProps) => {
  return (
    <div
      className={styles.RegionalDimensions}
      style={{ backgroundImage: `url(${acf.tmd.background_image.url})` }}
    >
      <Container size={"xl"} py={60}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4.5 }}>
            <h2 className={styles.TitleWithIcon}>
              <img src={"/local/svg/simbol.svg"} />
              {acf.tmd.title}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: acf.tmd.subtitle }} />
            <a href={""}>
              <Button style={{ fontWeight: 400 }} mt={20}>
                Explore the content
              </Button>
            </a>
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
                    target={`${region ? "/" + region : ""}/dimensions/${
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

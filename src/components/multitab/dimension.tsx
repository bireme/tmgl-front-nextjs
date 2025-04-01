import { Container, Grid, Tabs } from "@mantine/core";

import styles from "../../styles/components/multitab.module.scss";

export interface DimensionMultitabProps {
  content: string;
}
export const DimensionMultitab = ({ content }: DimensionMultitabProps) => {
  const sections = content.split(/<h3 class="wp-block-heading">/).slice(1);
  return (
    <div className={styles.DimensionsMultitabContainer}>
      <Container py={40} size={"xl"}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="index0">
              <Tabs.List>
                {sections?.map((item, k) => (
                  <Tabs.Tab key={k} value={"index" + k}>
                    {item.split(/<\/h3>/)[0]}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {sections?.map((item, k) => (
                <Tabs.Panel key={k} value={"index" + k}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.split(/<\/h3>/)[1],
                    }}
                  />
                </Tabs.Panel>
              ))}
            </Tabs>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

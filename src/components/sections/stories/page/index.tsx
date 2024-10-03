import { Container, Grid, Image } from "@mantine/core";

import { FeaturedStoriesAcf } from "@/services/types/featuredStoriesAcf";
import { setConfig } from "next/config";
import styles from "../../../../styles/components/feature-stories.module.scss";

export interface SectionProps {
  acf: FeaturedStoriesAcf;
}
export const FirstSection = ({ acf }: SectionProps) => {
  return (
    <div
      className={styles.FirstSection}
      style={{
        backgroundColor: `${acf.first_session.background}`,
        backgroundImage: `url('${acf.first_session.imagem.url}')`,
      }}
    >
      <Container size={"xl"} py={60}>
        <div
          className={styles.Content}
          dangerouslySetInnerHTML={{ __html: acf.first_session.content }}
        />
      </Container>
    </div>
  );
};

export const SecondSection = ({ acf }: SectionProps) => {
  return (
    <div
      className={styles.SecondSection}
      style={{ backgroundColor: `${acf.second_session.background}` }}
    >
      <Container size={"xl"} py={60}>
        <Grid>
          <Grid.Col span={{ md: 8 }} p={40}>
            <div
              className={styles.Content}
              dangerouslySetInnerHTML={{ __html: acf.second_session.content }}
            />
          </Grid.Col>
          <Grid.Col span={{ md: 4 }} p={40}>
            <Image
              alt={acf.second_session.imagem.alt}
              src={acf.second_session.imagem.url}
              radius={"md"}
              width={"100%"}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export const ThirdSection = ({ acf }: SectionProps) => {
  return (
    <div
      className={styles.ThirdSection}
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.40) 60%, rgba(0,0,0,0.5) 100%), url('${acf.third_session.imagem.url}')`,
      }}
    >
      <Container size={"md"} p={50}>
        <div
          className={styles.Content}
          dangerouslySetInnerHTML={{ __html: acf.third_session.content }}
        />
      </Container>
    </div>
  );
};

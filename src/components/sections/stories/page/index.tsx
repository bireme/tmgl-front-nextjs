import { Container } from "@mantine/core";
import { FeaturedStoriesAcf } from "@/services/types/featuredStoriesAcf";
import styles from "../../../../styles/components/feature-stories.module.scss";

export interface FirstSectionProps {
  acf: FeaturedStoriesAcf;
}
export const FirstSection = ({ acf }: FirstSectionProps) => {
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

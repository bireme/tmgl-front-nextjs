import { Button, Container, Flex } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/components/sections.module.scss";

export interface EvidenceMapProps {
  title: string;
  excerpt: string;
  href: string;
}

export const EvidenceMapItem = ({ title, excerpt, href }: EvidenceMapProps) => {
  return (
    <Flex
      p={16}
      className={styles.EvidenceMapItem}
      direction={"column"}
      align={"flex-end"}
      justify={"space-between"}
    >
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <Button size={"xs"} p={5}>
        <a href={href}>
          <IconArrowRight />
        </a>
      </Button>
    </Flex>
  );
};

export const EvidenceMapsSection = () => {
  return (
    <div className={styles.EvidenceMapsSection}>
      <Container py={60} size={"xl"}>
        <Flex direction={{ base: "column", md: "row" }} gap={30}>
          <EvidenceMapItem
            title={
              "Evidence map on the clinical effectiveness of Brazilian medicinal plants"
            }
            excerpt="An overview of the evidence on the effects of Brazilian Medicinal Plants on health outcomes. Based on an extensive literature search, 214 systematic review studies were included in the map. All the studies were assessed, characterized and categorized by a group of researchers from the Natural Products Technology Laboratory (LTPN) at the Faculty of Pharmacy of the Fluminense Federal University."
            href="/"
          />
          <EvidenceMapItem
            title={
              "Evidence map on the clinical effectiveness of Brazilian medicinal plants"
            }
            excerpt="An overview of the evidence on the effects of Brazilian Medicinal Plants on health outcomes. Based on an extensive literature search, 214 systematic review studies were included in the map. All the studies were assessed, characterized and categorized by a group of researchers from the Natural Products Technology Laboratory (LTPN) at the Faculty of Pharmacy of the Fluminense Federal University."
            href="/"
          />
          <EvidenceMapItem
            title={
              "Evidence map on the clinical effectiveness of Brazilian medicinal plants"
            }
            excerpt="An overview of the evidence on the effects of Brazilian Medicinal Plants on health outcomes. Based on an extensive literature search, 214 systematic review studies were included in the map. All the studies were assessed, characterized and categorized by a group of researchers from the Natural Products Technology Laboratory (LTPN) at the Faculty of Pharmacy of the Fluminense Federal University."
            href="/"
          />
        </Flex>
        <a href={""} className={styles.MoreLink}>
          Explore more evidence maps{" "}
          <Button size={"xs"} p={5}>
            <IconArrowRight />
          </Button>
        </a>
      </Container>
    </div>
  );
};

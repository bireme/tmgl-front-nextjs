import { Button, Container, Flex } from "@mantine/core";

import { FixedRelatedVideosSection } from "@/components/videos";
import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

interface MultimediaItem {
  title: string;
  url: string;
  image: string;
}

interface MultimediaSectionProps {
  multimediaItems?: MultimediaItem[];
  relatedVideoTitle?: string;
  moreMediaUrl?: string;
  exploreAllLabel?: string;
  className?: string;
  backgroundColor?: string;
}

export function MultimediaSection({
  multimediaItems,
  relatedVideoTitle = "Related videos",
  moreMediaUrl,
  exploreAllLabel = "Explore all",
  backgroundColor,
  className,
}: MultimediaSectionProps) {
  const router = useRouter();
  
  if (!multimediaItems || multimediaItems.length === 0) return null;
  return (
    <div style={{ float: "left", width: "100%", backgroundColor: backgroundColor ?? "iherit" }} className={className}>
      <FixedRelatedVideosSection
        title={relatedVideoTitle}
        items={multimediaItems.map((item) => ({
          title: item.title,
          href: item.url,
          thumbnail: item.image,
        }))}
      />
      <Container mt={0} pt={0} mb={40} size={"xl"}>
        {moreMediaUrl && (
          <Flex
            mt={25}
            gap={10}
            align={"center"}
            onClick={() => {
              moreMediaUrl &&
              router.push(moreMediaUrl);
            }}
            component="a"
            style={{ cursor: "pointer" }}
          >
            {exploreAllLabel}{" "}
            <Button size={"xs"} p={5}>
              <IconArrowRight stroke={1} />
            </Button>
          </Flex>
        )}
      </Container>
    </div>
  );
}

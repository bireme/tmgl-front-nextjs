import { ItemResource, Post } from "@/services/types/posts.dto";
import { useCallback, useContext, useEffect, useState } from "react";

import { Flex } from "@mantine/core";
import { GlobalContext } from "@/contexts/globalContext";
import { PostsApi } from "@/services/posts/PostsApi";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

// Export new reusable components
export { PageHeaderSection } from "./pageHeader/PageHeaderSection";
export { LayoutToggle } from "./layoutToggle/LayoutToggle";
export { DescriptionSection } from "./description/DescriptionSection";
export { HeroSection } from "./hero/HeroSection";
export { ContentSection } from "./content/ContentSection";
export { ResourcesSection } from "./resources/ResourcesSection";
export { NewsEventsSection } from "./newsEvents/NewsEventsSection";
export { FundingOpportunitiesSection } from "./fundingOpportunities/FundingOpportunitiesSection";
export { PeriodicalsSection } from "./periodicals/PeriodicalsSection";
export { FundingAndPeriodicalsSection } from "./fundingAndPeriodicals/FundingAndPeriodicalsSection";
export { MultimediaSection } from "./multimedia/MultimediaSection";
export { JournalsSection } from "./journals/JournalsSection";
export { PagesSection } from "./pages/PagesSection";

export interface TraditionalSectionCardProps {
  iconPath: string;
  title: string;
  target?: string;
  sm?: boolean;
}
export const TraditionalSectionCard = ({
  iconPath,
  title,
  target,
  sm,
}: TraditionalSectionCardProps) => {
  const router = useRouter();
  return (
    <Flex
      p={sm ? 20 : 40}
      className={`${styles.TraditionalSection} ${sm ? styles.Small : ""}`}
      onClick={() => {
        window.open(target ?? "/", "_blank");
      }}
      justify={"center"}
      align={"center"}
      direction={"column"}
    >
      <img src={iconPath} />
      <p>{decodeHtmlEntities(title)}</p>
    </Flex>
  );
};

export const DimensionsSection = ({ items }: { items?: ItemResource[] }) => {
  const [posts, setPosts] = useState<Array<Post>>();
  const _api = new PostsApi();
  const getDimensions = useCallback(async () => {
    try {
      const result = await _api.getCustomPost("dimensions", 20, 0);
      setPosts(result);
    } catch (error: any) {
      console.log("Error while trying to get Dimensions: ", error);
    }
  }, []);

  useEffect(() => {
    if (!items) getDimensions();
  }, [getDimensions]);

  return (
    <>
      <Flex
        mt={80}
        direction={{ base: "row" }}
        wrap={"wrap"}
        gap={{ md: 80, base: 20 }}
        justify={"center"}
        align={"center"}
      >
        {!items
          ? posts?.map((dimension, key) => {
              return (
                <TraditionalSectionCard
                  key={key}
                  iconPath={_api.findFeaturedMedia(dimension, "full")}
                  target={`/dimensions/${dimension.slug}`}
                  title={dimension.title.rendered}
                />
              );
            })
          : items.map((item, key) => {
              return (
                <TraditionalSectionCard
                  key={key}
                  iconPath={item.icon}
                  target={item.url}
                  title={item.title}
                />
              );
            })}
      </Flex>
    </>
  );
};

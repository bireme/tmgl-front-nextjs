import { Button, Container, Flex, Grid } from "@mantine/core";
import { DefaultCard, ResourceCard } from "@/components/feed/resourceitem";
import { HeadingItem, smallItemObj } from "@/services/types/posts.dto";

import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

interface FundingOpportunitiesSectionProps {
  fundingOpportunities: smallItemObj[];
  fundingHeading?: HeadingItem;
  fundingTitle?: string;
  otherFundingTitle?: string;
  showMoreFundingLink?: string;
  exploreAllLabel?: string;
  className?: string;
  hideSeeMoreButton?: boolean;
}

export function FundingOpportunitiesSection({
  fundingOpportunities,
  fundingHeading,
  fundingTitle = "Funding Opportunities",
  otherFundingTitle = "Other Funding Opportunities",
  hideSeeMoreButton = false,
}: FundingOpportunitiesSectionProps) {
  const router = useRouter();

  const renderFundingColumn = (
    items: smallItemObj[],
    heading: HeadingItem | undefined,
    title: string,
    otherTitle: string
  ) => {
    if (!heading && items.length === 0) return null;
    return (
      <>
        <Grid.Col span={{ md: 6, base: 12 }} pr={20}>
          <h3 className={styles.TitleWithIcon}>{title}</h3>
          <Flex
            gap="30px"
            wrap="wrap"
            direction="row"
            justify="space-between"
            align="stretch"
            style={{ minHeight: "535px" }}
          >
            {/* Main item - usando HeadingItem */}
            <div style={{ flex: 1, display: "flex", minHeight: "100%" }}>
              <div style={{ height: "100%" }}>
                <ResourceCard
                  fullWidth
                  title={heading?.title || ""}
                  displayType="column"
                  excerpt={heading?.description || ""}
                  image={heading?.image && typeof heading.image === 'string' ? heading.image : ""}
                  link={!hideSeeMoreButton ? heading?.url || "#" : undefined}
                  tags={[]}
                />
              </div>
            </div>

            {/* Other items - usando smallItemObj */}
            {items.length > 0 ? (
              <div style={{ flex: 1, display: "flex", minHeight: "100%" }}>
                <DefaultCard
                  fullWidth
                  displayType="column"
                  justify="flex-start"
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    style={{ width: "100%" }}
                    className={`${styles.BlueTitle} ${styles.small}`}
                  >
                    {otherTitle}
                  </h3>
                  <Flex direction={"column"} gap={20}>
                    {items.slice(0, 3).map((item, key) => (
                      <a
                        className={styles.linkTitle}
                        href={item.url || "#"}
                        key={key}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    ))}
                  </Flex>
                </DefaultCard>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", minHeight: "100%" }} />
            )}
          </Flex>
        </Grid.Col>
      </>
    );
  };

  return (
    <>
      {renderFundingColumn(
        fundingOpportunities,
        fundingHeading,
        fundingTitle,
        otherFundingTitle
      )}
    </>
  );
}

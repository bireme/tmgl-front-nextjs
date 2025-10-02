import { Button, Container, Flex, Grid } from "@mantine/core";
import { HeadingItem, smallItemObj } from "@/services/types/posts.dto";

import { FundingOpportunitiesSection } from "../fundingOpportunities/FundingOpportunitiesSection";
import { IconArrowRight } from "@tabler/icons-react";
import { PeriodicalsSection } from "../periodicals/PeriodicalsSection";

interface FundingAndPeriodicalsSectionProps {
  fundingOpportunities: smallItemObj[];
  periodicals: smallItemObj[];
  fundingHeading?: HeadingItem;
  periodicalsHeading?: HeadingItem;
  fundingTitle?: string;
  otherFundingTitle?: string;
  periodicalsTitle?: string;
  otherPeriodicalsTitle?: string;
  showMoreFundingLink?: string;
  showMorePeriodicalsLink?: string;
  exploreAllLabel?: string;
  className?: string;
  hideExploreAllPeriodicals?: boolean;
  hideExploreAllFunding?: boolean;
  hideSeeMoreButtonFunding?: boolean;
  hideSeeMoreButtonPeriodicals?: boolean;
}

export function FundingAndPeriodicalsSection({
  fundingOpportunities,
  periodicals,
  fundingHeading,
  periodicalsHeading,
  fundingTitle = "Funding Opportunities",
  otherFundingTitle = "Other Funding Opportunities",
  periodicalsTitle = "Periodicals",
  otherPeriodicalsTitle = "Other Periodicals",
  showMoreFundingLink,
  showMorePeriodicalsLink,
  exploreAllLabel = "Explore all",
  hideExploreAllPeriodicals = false,
  hideExploreAllFunding = false,
  hideSeeMoreButtonFunding = false,
  hideSeeMoreButtonPeriodicals = false,
  className,
}: FundingAndPeriodicalsSectionProps) {
  // Se não há dados para exibir, não renderiza nada
  if (!fundingHeading && !periodicalsHeading && fundingOpportunities.length === 0 && periodicals.length === 0) {
    return null;
  }

  return (
    <Container size={"xl"} py={60} className={className}>
      <Grid>
        {/* Funding Opportunities Column */}
        {(fundingHeading || fundingOpportunities.length > 0) && (
          <FundingOpportunitiesSection
            fundingOpportunities={fundingOpportunities}
            fundingHeading={fundingHeading}
            fundingTitle={fundingTitle}
            otherFundingTitle={otherFundingTitle}
            showMoreFundingLink={showMoreFundingLink}
            exploreAllLabel={exploreAllLabel}
            hideSeeMoreButton={hideSeeMoreButtonFunding}
            className=""
          />
        )}

        {/* Periodicals Column */}
        {(periodicalsHeading || periodicals.length > 0) && (
          <PeriodicalsSection
            periodicals={periodicals}
            periodicalsHeading={periodicalsHeading}
            periodicalsTitle={periodicalsTitle}
            otherPeriodicalsTitle={otherPeriodicalsTitle}
            showMorePeriodicalsLink={showMorePeriodicalsLink}
            exploreAllLabel={exploreAllLabel}
            hideSeeMoreButton={hideSeeMoreButtonPeriodicals}
            className=""
          />
        )}
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 6, md: 6 }}>
          {!hideExploreAllFunding && showMoreFundingLink && (fundingHeading || fundingOpportunities.length > 0) && (
            <Flex
              mt={25}
              gap={10}
              align={"center"}
              onClick={() => {
                window.open(showMoreFundingLink, '_blank');
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
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 6 }}>
          {!hideExploreAllPeriodicals && showMorePeriodicalsLink && (periodicalsHeading || periodicals.length > 0) && (
            <Flex
              mt={25}
              gap={10}
              align={"center"}
              onClick={() => {
                window.open(showMorePeriodicalsLink, '_blank');
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
        </Grid.Col>
      </Grid>
    </Container>
  );
}

import { Button, Container, Flex, Grid } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { DefaultCard, ResourceCard } from "@/components/feed/resourceitem";
import { Post } from "@/services/types/posts.dto";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/pages/home.module.scss";

interface NewsEventsSectionProps {
  news: Post[];
  events: Post[];
  newsTitle?: string;
  otherNewsTitle?: string;
  eventsTitle?: string;
  otherEventsTitle?: string;
  showMoreNewsLink?: string;
  showMoreEventsLink?: string;
  exploreAllLabel?: string;
  className?: string;
}

export function NewsEventsSection({
  news,
  events,
  newsTitle = "News",
  otherNewsTitle = "Other News",
  eventsTitle = "Events",
  otherEventsTitle = "Other Events",
  showMoreNewsLink,
  showMoreEventsLink,
  exploreAllLabel = "Explore all",
  className,
}: NewsEventsSectionProps) {
  const _api = new PostsApi();

  const renderNewsEventsColumn = (
    items: Post[],
    title: string,
    otherTitle: string,
    linkPrefix: string,
    showMoreLink?: string
  ) => {
    if (items.length === 0) return null;

    return (
      <Grid.Col span={{ md: 6, base: 12 }} pr={20}>
        <h3 className={styles.TitleWithIcon}>{title}</h3>
        <Flex
          gap="30px"
          wrap="wrap"
          direction="row"
          justify="space-between"
          align="stretch"
          style={{ minHeight: "400px" }}
        >
          {/* Main item */}
          <div style={{ flex: 1, display: "flex", minHeight: "100%" }}>
            <div style={{ height: "100%" }}>
              <ResourceCard
                fullWidth
                title={items[0].title.rendered}
                displayType="column"
                excerpt={removeHTMLTagsAndLimit(items[0].excerpt.rendered, 180)}
                image={_api.findFeaturedMedia(items[0], "large")}
                link={`${linkPrefix}/${items[0].slug}`}
                tags={[]}
              />
            </div>
          </div>
          
          {/* Other items */}
          {items.length > 1 ? (
            <div style={{ flex: 1, display: "flex", minHeight: "100%" }}>
              <DefaultCard
                fullWidth
                displayType="column"
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  alignItems: "flex-start",
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

                {items.slice(1, 4).map((item, key) => (
                  <a
                    className={styles.linkTitle}
                    href={`${linkPrefix}/${item.slug}`}
                    key={key}
                  >
                    {item.title.rendered}
                  </a>
                ))}
              </DefaultCard>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", minHeight: "100%" }} />
          )}
        </Flex>
        
        {/* Show more link */}
        {showMoreLink && (
          <Flex
            mt={25}
            gap={10}
            align={"center"}
            onClick={() => {
              // Handle show more action
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
    );
  };

  return (
    <Container size={"xl"} py={60} className={className}>
      <Grid>
        {renderNewsEventsColumn(
          news,
          newsTitle,
          otherNewsTitle,
          "/news",
          showMoreNewsLink
        )}
        {renderNewsEventsColumn(
          events,
          eventsTitle,
          otherEventsTitle,
          "/events",
          showMoreEventsLink
        )}
      </Grid>
    </Container>
  );
}

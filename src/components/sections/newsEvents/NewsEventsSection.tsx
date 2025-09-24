import { Button, Container, Flex, Grid } from "@mantine/core";
import { DefaultCard, ResourceCard } from "@/components/feed/resourceitem";

import { IconArrowRight } from "@tabler/icons-react";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const renderNewsEventsColumn = (
    items: Post[],
    title: string,
    otherTitle: string,
    linkPrefix: string
  ) => {
    if (items.length === 0) return null;
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
            {/* Main item */}
            <div style={{ flex: 1, display: "flex", minHeight: "100%" }}>
              <div style={{ height: "100%" }}>
                <ResourceCard
                  fullWidth
                  title={items[0].title.rendered}
                  displayType="column"
                  excerpt={removeHTMLTagsAndLimit(
                    items[0].excerpt.rendered,
                    180
                  )}
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
                    {items.slice(1, 4).map((item, key) => (
                      <a
                        className={styles.linkTitle}
                        href={`${linkPrefix}/${item.slug}`}
                        key={key}
                      >
                        {item.title.rendered}
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
    <Container size={"xl"} py={60} className={className}>
      <Grid>
        {renderNewsEventsColumn(news, newsTitle, otherNewsTitle, "/news")}
        {renderNewsEventsColumn(
          events,
          eventsTitle,
          otherEventsTitle,
          "/events"
        )}
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 6, md: 6 }}>
          {showMoreEventsLink && news.length > 0 && (
            <Flex
              mt={25}
              gap={10}
              align={"center"}
              onClick={() => {
                router.push(showMoreEventsLink);
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
          {showMoreNewsLink && events.length > 0 && (
            <Flex
              mt={25}
              gap={10}
              align={"center"}
              onClick={() => {
                router.push(showMoreNewsLink);
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

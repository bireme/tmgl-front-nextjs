import {
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { IconPrinter, IconShare, } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import Head from "next/head";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { ShareModal } from "@/components/share";
import { TagItem } from "@/components/feed/resourceitem";
import homeStyles from "../../styles/pages/home.module.scss";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Events() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const _api = new PostsApi();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("event", slug);
      setTags(_api.formatTags(resp[0]));
      setPost(resp[0]);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (slug) getPost(slug.toString());
  }, [getPost, slug]);

  const tagColors = {
    country: "#54831B",
    descriptor: "#8B142A",
    region: "#3F6114",
  };

  return (
    <>
      <Head>
        <title>{post?.title.rendered ? `${post.title.rendered} - ` : ''}The WHO Traditional Medicine Global Library</title>
      </Head>
      {post ? (
        <>
          <Container mt={80} size={"xl"}>
            <BreadCrumbs
              path={[
                { path: "/", name: "HOME" },
                { path: "/events", name: "Events" },
              ]}
              blackColor={true}
            />
          </Container>
          <Container mt={40} size={"xl"}>
            <p className={styles.CategoryLabel}>Events</p>
            <h1 className={styles.PostTitle}>{post.title.rendered}</h1>
            <div
              className={styles.PostSubtitle}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <Flex
              className={styles.CatAndFunctions}
              direction={"row"}
              align={"center"}
              justify={"space-between"}
              py={20}
              mb={10}
            >
              <div>
                <Flex wrap={"wrap"} gap={5} className={styles.Tags}>
                  {tags
                    ?.filter((tag) => tag.type == "descriptor")
                    .map((tag) => (
                      <Badge
                        size={"lg"}
                        key={tag.name}
                        color={tagColors.descriptor}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    ?.filter((tag) => tag.type == "region")
                    .map((tag) => (
                      <Badge
                        size={"lg"}
                        key={tag.name}
                        color={tagColors.region}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    ?.filter((tag) => tag.type == "country")
                    .map((tag) => (
                      <Badge
                        size={"lg"}
                        key={tag.name}
                        color={tagColors.country}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </Flex>
              </div>
              <Flex className={styles.functions} gap={20}>
                <span
                  onClick={() => {
                    setOpenShareModal(true);
                  }}
                >
                  <IconShare /> Share
                </span>
                <span onClick={() => window.print()}>
                  <IconPrinter /> Print
                </span>
              </Flex>
            </Flex>
            <Grid>
              <Grid.Col span={{ md: 12, lg: 8 }} px={20}>
                {_api.findFeaturedMedia(post, "full") &&
                post?.acf?.programee ? (
                  <>
                    <div
                      className={styles.PostFeaturedImage}
                      style={{
                        backgroundImage: `url(${_api.findFeaturedMedia(
                          post,
                          "full"
                        )})`,
                        height: "500px",
                        marginTop: "20px",
                      }}
                    />
                    {post._embedded ? (
                      post._embedded["wp:featuredmedia"]?.length > 0 ? (
                        <div
                          className={styles.MediaCaption}
                          dangerouslySetInnerHTML={{
                            __html:
                              post._embedded["wp:featuredmedia"][0].caption
                                .rendered,
                          }}
                        ></div>
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <br />
                {post?.acf?.programee ? (
                  <>
                    <h2
                      className={`${homeStyles.BlueTitle} ${homeStyles.small}`}
                    >
                      Programme
                    </h2>
                    <div
                      className={styles.EventImg}
                      dangerouslySetInnerHTML={{ __html: post?.acf?.programee }}
                    />
                  </>
                ) : (
                  <></>
                )}
                {post.acf?.about && 
                (
                  <>
                    <h2 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                      About the event
                    </h2>
                      <div
                        className={styles.PostContent}
                        dangerouslySetInnerHTML={{ __html: post.acf?.about }}
                      />
                  </>
                )
                }
                
                
              </Grid.Col>
              <Grid.Col span={{ md: 12, lg: 4 }}>
                <h2 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                  Event Data
                </h2>
                <p>
                  <b>Date</b>
                  <br />
                  {post.acf?.initial_date} - {post.acf?.final_date}
                </p>

                {post.acf?.address ? (
                  <p>
                    <b>Venue</b>
                    <br />
                    {post.acf?.address}
                  </p>
                ) : (
                  <></>
                )}

                <h2 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                  Related content
                </h2>
                {post.acf?.releated_content ? (
                  post.acf?.releated_content.map((item: any, key: number) => (
                    <a
                      key={key}
                      style={{ color: "white", textDecoration: "none" }}
                      href={item.type == "Link" ? item.link : item.file}
                    >
                      <Button>{item.label}</Button>
                    </a>
                  ))
                ) : (
                  <></>
                )}
              </Grid.Col>
            </Grid>
          </Container>
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        link={fullUrl ? fullUrl : ""}
      />
    </>
  );
}

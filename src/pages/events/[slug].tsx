import {
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { IconPrinter, IconShare, IconShare3 } from "@tabler/icons-react";
import { countWords, extimateTime } from "@/helpers/stringhelper";
import moment, { lang } from "moment";
import { useCallback, useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
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
      console.log("Error while trying to get event");
    }
  }, []);

  useEffect(() => {
    if (slug) getPost(slug.toString());
  }, [getPost, slug]);

  const tagColors = {
    country: "#69A221",
    descriptor: "#8B142A",
    region: "#3F6114",
  };

  return (
    <>
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
            <h3 className={styles.TitleWithIcon}>Events</h3>
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
                    <h4
                      className={`${homeStyles.BlueTitle} ${homeStyles.small}`}
                    >
                      Programme
                    </h4>
                    <div
                      className={styles.EventImg}
                      dangerouslySetInnerHTML={{ __html: post?.acf?.programee }}
                    />
                  </>
                ) : (
                  <></>
                )}
                <h4 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                  About the event
                </h4>
                {!post?.acf?.programee ? (
                  <div
                    className={styles.PostContent}
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                ) : (
                  <div
                    className={styles.PostSubtitle}
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                )}
              </Grid.Col>
              <Grid.Col span={{ md: 12, lg: 4 }}>
                <h4 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                  Event Data
                </h4>
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

                <h4 className={`${homeStyles.BlueTitle} ${homeStyles.small}`}>
                  Related content
                </h4>
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

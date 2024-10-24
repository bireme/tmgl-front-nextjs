import { Container, Flex, LoadingOverlay } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import { countWords, extimateTime } from "@/helpers/stringhelper";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import moment from "moment";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Content() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const _api = new PostsApi();

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("pages", slug);
      setPost(resp[0]);
    } catch {
      console.log("Error while trying to get page");
    }
  }, []);

  useEffect(() => {
    if (slug) getPost(slug.toString());
  }, [getPost, slug]);

  return (
    <>
      {post ? (
        <>
          <Container mt={80} size={"xl"}>
            <BreadCrumbs
              path={[
                { path: "/", name: "HOME" },
                {
                  path: `/content/${slug ? slug.toString() : ""}`,
                  name: slug ? slug.toString().toUpperCase() : "",
                },
              ]}
              blackColor={true}
            />
          </Container>
          <Container mt={40} size={"md"}>
            <h3 className={styles.TitleWithIcon}>Content</h3>
            <h1 className={styles.PostTitle}>{post.title.rendered}</h1>
            <div
              className={styles.PostSubtitle}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <div className={styles.PostProps}>
              <span>
                {moment(post.date).format("DD MMMM YYYY")} | Reading time:{" "}
                {extimateTime(countWords(post.content.rendered))} min (
                {countWords(post.content.rendered)} words){" "}
              </span>
            </div>
            <Flex
              className={styles.CatAndFunctions}
              direction={"row"}
              align={"center"}
              justify={"space-between"}
              py={20}
              mb={10}
            >
              <div></div>
              <Flex className={styles.functions} gap={20}>
                <span>
                  <IconShare /> Share
                </span>
                <span>
                  <IconPrinter /> Print
                </span>
              </Flex>
            </Flex>
            {_api.findFeaturedMedia(post, "full") ? (
              <>
                <div
                  className={styles.PostFeaturedImage}
                  style={{
                    backgroundImage: `url(${_api.findFeaturedMedia(
                      post,
                      "full"
                    )})`,
                  }}
                />
              </>
            ) : (
              <></>
            )}

            <div
              className={styles.PostContent}
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </Container>
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
}

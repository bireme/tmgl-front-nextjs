import { Container, Flex, LoadingOverlay } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import {
  countWords,
  decodeHtmlEntities,
  extimateTime,
} from "@/helpers/stringhelper";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { ShareModal } from "@/components/share";
import moment from "moment";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Content() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const [parent, setParent] = useState<Post>();
  const _api = new PostsApi();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, [router.asPath]);

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("pages", slug);
      setPost(resp[0]);
      if (resp[0].parent) {
        const parentResp = await _api.getPostById("pages", resp[0].parent);
        setParent(parentResp[parentResp.length - 1]);
      }
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
            {parent ? (
              <h3 className={styles.TitleWithIcon}>
                {decodeHtmlEntities(parent.title.rendered)}
              </h3>
            ) : (
              <></>
            )}

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
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        link={fullUrl ? fullUrl : ""}
      />
    </>
  );
}

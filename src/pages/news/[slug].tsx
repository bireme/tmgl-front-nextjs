import { Container, Flex, LoadingOverlay } from "@mantine/core";
import { IconPrinter, IconShare, IconShare3 } from "@tabler/icons-react";
import { countWords, extimateTime } from "@/helpers/stringhelper";
import moment, { lang } from "moment";
import { useCallback, useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { ShareModal } from "@/components/share";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function News() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const _api = new PostsApi();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("posts", slug);
      setPost(resp[0]);
    } catch {
      console.log("Error while trying to get dimension");
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
                { path: "/news", name: "News" },
              ]}
              blackColor={true}
            />
          </Container>
          <Container mt={40} size={"md"}>
            <h3 className={styles.TitleWithIcon}>News</h3>
            <h1 className={styles.PostTitle}>{post.title.rendered}</h1>
            <div
              className={styles.PostSubtitle}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <div className={styles.PostProps}>
              <span>
                {moment(post.date).format("DD MMMM YYYY")} | Reading time:{" "}
                {extimateTime(countWords(post.content.rendered))} (
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

            <div
              className={styles.PostContent}
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </Container>
          {/* <RelatedVideosSection />
          <RecomendedArticlesSection limit={3} /> */}
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

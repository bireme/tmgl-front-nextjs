import { BreadCrumbs, pathItem } from "@/components/breadcrumbs";
import { Container, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { IconPrinter, IconShare } from "@tabler/icons-react";
import {
  countWords,
  decodeHtmlEntities,
  extimateTime,
} from "@/helpers/stringhelper";
import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Multitabs } from "@/components/multitab";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { RelatedArticlesSection } from "@/components/sections/recomended";
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
  const _api = new PostsApi();
  const [parent, setParent] = useState<Post>();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [releatedNumber, setReleatedNumber] = useState(0);
  const [breadcrumbsPath, setBreadcrumbsPath] = useState<pathItem[]>();

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("pages", slug);
      setPost(resp[0]);
      if (resp[0].parent) {
        const parentResp = await _api.getPostById("pages", resp[0].parent);
        if (parentResp) {
          setBreadcrumbsPath([
            { path: `/`, name: "HOME" },
            {
              path: `/content/${parentResp.slug}`,
              name: parentResp.title.rendered,
            },
            {
              path: `/content/${slug ? slug.toString() : ""}`,
              name: slug ? slug.toString() : "",
            },
          ]);
        }
        setParent(parentResp);
      }
    } catch {
      console.log("Error while trying to get page");
    }
  }, []);

  useEffect(() => {
    if (slug) {
      setBreadcrumbsPath([
        { path: `/`, name: "HOME" },
        {
          path: `/content/${slug ? slug.toString() : ""}`,
          name: slug ? slug.toString() : "",
        },
      ]);
      getPost(slug.toString());
    }
  }, [getPost, slug]);

  return (
    <>
      {post ? (
        <>
          <Container mt={80} size={"xl"}>
            {breadcrumbsPath ? (
              <BreadCrumbs path={breadcrumbsPath} blackColor={true} />
            ) : (
              <></>
            )}
          </Container>
          <Container mt={40} size={releatedNumber > 0 ? "xl" : "lg"}>
            <Grid>
              <Grid.Col span={releatedNumber > 0 ? 9 : 12} px={20}>
                <h3 className={styles.TitleWithIcon}>
                  {decodeHtmlEntities(
                    parent?.title?.rendered ? parent.title.rendered : ""
                  )}
                </h3>
                <h1 className={styles.PostTitle}>{post.title.rendered}</h1>

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
                {post.acf?.Itens ? (
                  <>
                    <Multitabs props={post.acf?.Itens} />
                  </>
                ) : (
                  <></>
                )}
              </Grid.Col>
              <Grid.Col span={3} px={20}>
                <RelatedArticlesSection
                  postTypeSlug="pages"
                  limit={99}
                  parent={post.id}
                  callBack={setReleatedNumber}
                />
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

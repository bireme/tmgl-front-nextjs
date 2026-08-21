import { Badge, Container, Flex, LoadingOverlay } from "@mantine/core";
import { GetServerSideProps } from "next";
import { IconPrinter, IconShare, IconShare3 } from "@tabler/icons-react";
import {
  countWords,
  decodeHtmlEntities,
  extimateTime,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import moment, { lang } from "moment";
import { useCallback, useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import Head from "next/head";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { ShareModal } from "@/components/share";
import { TagItem } from "@/components/feed/resourceitem";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";
import axios from "axios";

type NewsPageProps = {
  initialPost: Post;
  canonicalUrl: string;
};

export default function News({ initialPost, canonicalUrl }: NewsPageProps) {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>(initialPost);
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const _api = new PostsApi();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState<string | null>(canonicalUrl);
  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("posts", slug);
      setTags(_api.formatTags(resp[0]));
      setPost(resp[0]);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (slug) getPost(slug.toString());
  }, [getPost, slug]);

  useEffect(() => {
    if (router.isReady) {
      setFullUrl(new URL(router.asPath, window.location.origin).toString());
    }
  }, [router.asPath, router.isReady]);

  const shareTitle = decodeHtmlEntities(post?.title.rendered || "");
  const newsAcf = post?.acf as { subtitle?: string } | undefined;
  const subtitle = newsAcf?.subtitle?.trim()
    ? newsAcf.subtitle
    : post?.excerpt.rendered || "";
  const shareDescription = removeHTMLTagsAndLimit(
    decodeHtmlEntities(subtitle),
    200
  );
  const shareImage = post ? _api.findFeaturedMedia(post, "full") : "";

  const tagColors = {
    country: "#54831B",
    descriptor: "#8B142A",
    region: "#3F6114",
  };

  return (
    <>
      <Head>
        <title>{post?.title.rendered ? `${post.title.rendered} - ` : ''}The WHO Traditional Medicine Global Library</title>
        {shareDescription ? (
          <meta key="description" name="description" content={shareDescription} />
        ) : null}
        <meta key="og:type" property="og:type" content="article" />
        {shareTitle ? <meta key="og:title" property="og:title" content={shareTitle} /> : null}
        {shareDescription ? (
          <meta key="og:description" property="og:description" content={shareDescription} />
        ) : null}
        {fullUrl ? <meta property="og:url" content={fullUrl} /> : null}
        {shareImage ? <meta key="og:image" property="og:image" content={shareImage} /> : null}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        {shareTitle ? <meta key="twitter:title" name="twitter:title" content={shareTitle} /> : null}
        {shareDescription ? (
          <meta key="twitter:description" name="twitter:description" content={shareDescription} />
        ) : null}
        {shareImage ? <meta key="twitter:image" name="twitter:image" content={shareImage} /> : null}
        {fullUrl ? <link rel="canonical" href={fullUrl} /> : null}
      </Head>
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
            <p className={styles.CategoryLabel}>News</p>
            <h1 className={styles.PostTitle}>{post.title.rendered}</h1>
            {subtitle ? (
              <div
                className={`${styles.PostSubtitle} ${styles.NewsSubtitle}`}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            ) : null}
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
            {_api.findFeaturedMedia(post, "full") ? (
              <>
                <div
                  className={`${styles.PostFeaturedImage} ${styles.NewsFeaturedImage}`}
                  role="img"
                  aria-label={shareTitle}
                  style={{
                    backgroundImage: `url(${shareImage})`,
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
        title={shareTitle}
        description={shareDescription}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<NewsPageProps> = async (
  context
) => {
  const slug = context.params?.slug?.toString();
  const wpBaseUrl = process.env.WP_BASE_URL;

  if (!slug || !wpBaseUrl) return { notFound: true };

  try {
    const { data } = await axios.get<Post[]>(
      `${wpBaseUrl}/wp-json/wp/v2/posts`,
      {
        params: {
          slug,
          _embed: true,
          acf_format: "standard",
        },
      }
    );

    if (!data[0]) return { notFound: true };

    const forwardedProtocol = context.req.headers["x-forwarded-proto"];
    const forwardedHost = context.req.headers["x-forwarded-host"];
    const protocol = Array.isArray(forwardedProtocol)
      ? forwardedProtocol[0]
      : forwardedProtocol?.split(",")[0] || "http";
    const host = Array.isArray(forwardedHost)
      ? forwardedHost[0]
      : forwardedHost?.split(",")[0] || context.req.headers.host;

    if (!host) return { notFound: true };

    return {
      props: {
        initialPost: data[0],
        canonicalUrl: `${protocol}://${host}/news/${encodeURIComponent(slug)}`,
      },
    };
  } catch {
    return { notFound: true };
  }
};

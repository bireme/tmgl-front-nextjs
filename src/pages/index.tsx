import { Button, Center, Container, Flex, Modal } from "@mantine/core";
import { useCallback, useContext, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { DimensionsSection } from "@/components/sections";
import { EmbedIframe } from "@/components/embed/EmbedIframe";
import { EventsSection } from "@/components/sections/events";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";
import { ImageSection } from "@/components/video";
import Link from "next/link";
import { NewsSection } from "@/components/sections/news";
import { NewsletterSection } from "@/components/sections/newsletter";
import { PagesApi } from "@/services/pages/PagesApi";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingSlider } from "@/components/rss/slider";
import styles from "../styles/pages/home.module.scss";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";
import { useRouter } from "next/router";

export default function Home() {
  const _api = new PagesApi();
  const _postsApi = new PostsApi();
  const router = useRouter();
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const { setRegionName, globalConfig } = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const cacheRandom = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  const getPageProperties = useCallback(async () => {
    try {
      const resp = await _api.getPageProperties("home-global");


      setAcf(resp[0].acf);
      setSliderImages(resp[0].acf.search.slider_images);
    } catch { }
  }, []);

  useEffect(() => {
    getPageProperties();
    setRegionName("");
  }, [getPageProperties]);

  useEffect(() => {
    if (router.query.video === "1") {
      setShowVideoModal(true);
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Home - The WHO Traditional Medicine Global Library</title>
      </Head>
      <Modal
        title={"Warning"}
        onClose={() => setShowModal(false)}
        opened={showModal}
      ></Modal>
      <Modal
        opened={showVideoModal}
        onClose={() => {
          setShowVideoModal(false);
          setVideoStarted(false);
          // Remove a query string da URL ao fechar
          router.push(router.pathname, undefined, { shallow: true });
        }}
        size="95vw"
        centered
        withCloseButton
        title={null}
        classNames={{
          close: styles.VideoModalClose,
        }}
        styles={{
          body: { padding: 0 },
          content: {
            overflow: "hidden",
            border: "none",
            borderRadius: 0,
            padding: 0,
          },
          header: { display: "none" },
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
          {!videoStarted ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
                backgroundImage: "url(/video-thumb-test.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setVideoStarted(true)}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <IconPlayerPlay
                  size={40}
                  style={{ marginLeft: "4px", color: "#006CB0" }}
                  fill="#006CB0"
                />
              </div>
            </div>
          ) : (
            <video
              controls
              autoPlay
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            >
              <source src="/video-teste.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          )}
        </div>
      </Modal>
      <div className={styles.HeroSearch}>
        {sliderImages ? <HeroSlider images={sliderImages} /> : <></>}

        <div className={styles.FullContainer}>
          <Container size={"xl"}>
            <SearchForm
              title={acf?.search.title ? acf?.search.title : ""}
              subtitle={acf?.search.subtitle ? acf.search.subtitle : ""}
            />
          </Container>
        </div>
      </div>
      <ImageSection>
        <Container size={"xl"} py={"3%"} className={styles.TraditionalMedicine}>
          <h2>{acf?.tmd.title}</h2>
          <Center m={0} p={0}>
            <h3>{acf?.tmd.subtitle}</h3>
          </Center>

          <DimensionsSection items={acf?.itens} />
        </Container>
      </ImageSection>
      <div className={styles.NewsContainer}>
        <NewsSection
          title={"Thematic pages"}
          posType="thematic-pages"
          archive="thematic-page"
          includeDemo={true}
        />
      </div>

      <div className={styles.TrandingAndFeatured}>
        <Container
          size={"xl"}
          mt={80}
          className={styles.TrandingAndFeaturedContainer}
        >
          <h2 className={`${styles.TitleWithIcon} ${styles.center}`}>
            {capitalizeFirstLetter("Recent literature reviews")}
          </h2>
          <div className={styles.TrendingText}>
            <p>{acf?.text_trending_topics}</p>
            <Link
              href={"/recent-literature-reviews"}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "18px",
              }}
            >
              <Flex justify={"flex-start"} align={"center"} gap={10}>
                <p>Explore more</p>{" "}
                <Button p={5} size={"xs"}>
                  <IconArrowRight />
                </Button>
              </Flex>
            </Link>
          </div>
          <TrendingSlider />
        </Container>
        <Container size={"xl"}>
          {globalConfig?.acf.thematic_page_tag ? (
            <StoriesSection
              fetchOptions={{ tagId: globalConfig?.acf.thematic_page_tag, excludeTag: true }}
            />
          ) : (
            <></>
          )}

          <Link
            href={"/featured-stories"}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "18px",
            }}
          >
            <Flex justify={"flex-start"} align={"center"} gap={10}>
              <p>Explore more featured stories</p>{" "}
              <Button p={5} size={"xs"}>
                <IconArrowRight />
              </Button>
            </Flex>
          </Link>
          <br></br>
          <h2 className={styles.TitleWithIcon}>{capitalizeFirstLetter("Events")}</h2>
        </Container>
      </div>
      {globalConfig?.acf.thematic_page_tag && (
        <EventsSection excludedTagIds={[globalConfig?.acf.thematic_page_tag ? globalConfig?.acf.thematic_page_tag : 0]} />
      )}

      <div className={styles.NewsContainer}>
        <NewsSection excludedTagIds={[181]} title={"News from WHO"} />

        {acf?.embed_content && (
          <div className={styles.EmbedContent}>
            <Container size={"xl"}>
              <EmbedIframe
                src={`${acf?.embed_content}?v=${cacheRandom}`}
                width="100%"
                height={1300}
              />
            </Container>
          </div>
        )}
        {acf?.manual_media && acf.manual_media.length >= 3 ? (
          <>
            <FixedRelatedVideosSection
              items={[
                {
                  title: acf?.manual_media[0].title,
                  href: acf?.manual_media[0].url,
                  thumbnail: acf?.manual_media[0].image,
                },
                {
                  title: acf?.manual_media[1].title,
                  href: acf?.manual_media[1].url,
                  thumbnail: acf?.manual_media[1].image,
                },
                {
                  title: acf?.manual_media[2].title,
                  href: acf?.manual_media[2].url,
                  thumbnail: acf?.manual_media[2].image,
                },
              ]}
            />
            {acf.more_media_url && (
              <Container mt={0} pt={0} mb={40} size={"xl"}>
                <Flex
                  mt={25}
                  gap={10}
                  align={"center"}
                  onClick={() => {
                    window.open(acf.more_media_url, "self");
                  }}
                  component="a"
                  style={{ cursor: "pointer" }}
                >
                  See More
                  <Button size={"xs"} p={5}>
                    <IconArrowRight stroke={1} />
                  </Button>
                </Flex>

              </Container>

            )}

          </>
        ) : (
          <></>
        )}
        <NewsletterSection />
      </div>
    </>
  );
}

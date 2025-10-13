import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container, Title, Text, Image, Stack, Grid } from "@mantine/core";
import { GlobalContext } from "@/contexts/globalContext";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { GetStaticPaths, GetStaticProps } from "next";
import { useContext } from "react";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../styles/pages/home.module.scss";

interface FeaturedStoryPageProps {
  post: Post;
}

export default function FeaturedStoryPage({ post }: FeaturedStoryPageProps) {
  const { globalConfig } = useContext(GlobalContext);
  const _api = new PostsApi();

  if (!post) {
    return (
      <Container size={"xl"} py={40}>
        <Title>Story not found</Title>
      </Container>
    );
  }

  const featuredImage = _api.findFeaturedMedia(post, "large");
  const tags = _api.getPostTags(post);

  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/featured-stories", name: "Featured Stories" },
            { path: `/featured-stories/${post.slug}`, name: removeHTMLTagsAndLimit(post.title.rendered, 50) },
          ]}
          blackColor={true}
        />
        
        <Grid mt={40}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack spacing={30}>
              <Title order={1} className={styles.TitleWithIcon}>
                {post.title.rendered}
              </Title>
              
              {featuredImage && (
                <Image
                  src={featuredImage}
                  alt={post.title.rendered}
                  radius="md"
                  fit="cover"
                  height={400}
                />
              )}
              
              <div 
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                style={{ lineHeight: 1.6 }}
              />
              
              {tags.length > 0 && (
                <div>
                  <Text weight={600} mb={10}>Tags:</Text>
                  <Text size="sm" color="dimmed">
                    {tags.map(tag => tag.label).join(", ")}
                  </Text>
                </div>
              )}
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack spacing={20}>
              <div>
                <Text weight={600} mb={5}>Published:</Text>
                <Text size="sm" color="dimmed">
                  {new Date(post.date).toLocaleDateString()}
                </Text>
              </div>
              
              {post.excerpt.rendered && (
                <div>
                  <Text weight={600} mb={5}>Summary:</Text>
                  <Text size="sm" color="dimmed">
                    {removeHTMLTagsAndLimit(post.excerpt.rendered, 200)}
                  </Text>
                </div>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const _api = new PostsApi();
  const posts = await _api.getCustomPost("featured_stories", 100, 0);
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const _api = new PostsApi();
  
  try {
    const posts = await _api.getCustomPost("featured_stories", 100, 0);
    const post = posts.find((p) => p.slug === params?.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
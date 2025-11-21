import { Alert, Container, Flex, Grid } from "@mantine/core";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/pages/home.module.scss";
import { IconAlertCircleFilled } from "@tabler/icons-react";

interface CommunityInitiative {
  url: string;
  label: string;
}

interface ContentSectionProps {
  title: string;
  content: string;
  communityInitiatives?: CommunityInitiative[];
  communityInitiativesTitle?: string;
  className?: string;
  disclaimer?: string;
}

export function ContentSection({
  title,
  content,
  communityInitiatives,
  communityInitiativesTitle,
  className,
  disclaimer,
}: ContentSectionProps) {
  return (
    <div className={`${styles.TmPageContent} ${className || ""}`}>
      <Container size={"xl"} my={40}>
        <Grid>
          <Grid.Col span={{ md: 9, base: 12 }} px={20}>
            {disclaimer && (
              <div className={styles.Disclaimer}>
                <Alert color="yellow">
                  <Flex align={"center"} gap={10}>
                    <IconAlertCircleFilled size={60} color={"#dab526"} />
                    <div dangerouslySetInnerHTML={{ __html: disclaimer }} />
                  </Flex>
                </Alert>
              </div>
            )}
            <h2>{title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: content || "",
              }}
            />

          </Grid.Col>
          <Grid.Col span={{ md: 3, base: 12 }} px={20}>
            <div className={styles.SideContent}>
              {communityInitiatives && communityInitiatives.length > 0 && (
                <div className={styles.KeyResources}>
                  <h3>{communityInitiativesTitle || "Community Initiatives"}</h3>
                  {communityInitiatives.map((initiative, key) => {
                    return (
                      <p key={key}>
                        <a href={initiative.url} target={"_blank"}>
                          {decodeHtmlEntities(initiative.label)}
                        </a>
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

import { Container, Grid } from "@mantine/core";

import { CountryAcfResource } from "@/services/types/posts.dto";
import { decodeHtmlLink } from "@/helpers/stringhelper";
import styles from "@/styles/pages/home.module.scss";

interface CountryResourceSectionProps {
  resources?: CountryAcfResource[];
  title?: string;
}

export function CountryResourceSection({
  resources,
  title = "Resources",
}: CountryResourceSectionProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className={styles.CountryRersources}>
      <Container py={60} size={"xl"}>
        <h3 className={styles.TitleWithIcon}>{title}</h3>
        <Grid mt={40} gutter={{ base: 20, md: 30 }} justify="center">
          {resources.map((resource: CountryAcfResource, index: number) => {
            return (
              <Grid.Col
                key={index}
                span={{
                  base: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "30px 20px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e9ecef",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onClick={() =>
                    window.open(decodeHtmlLink(resource.url), "_blank")
                  }
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "50%",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <img
                      src={resource.icon}
                      alt={resource.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2c3e50",
                      margin: "0 0 10px 0",
                      lineHeight: "1.4",
                      minHeight: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {resource.title}
                  </h4>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      height: "4px",
                      background: "linear-gradient(90deg, #3498db, #2980b9)",
                      transform: "scaleX(0)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scaleX(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scaleX(0)";
                    }}
                  />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

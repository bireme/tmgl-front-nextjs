import { Button, Container, Flex } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
  capitalizeFirstLetter,
} from "@/helpers/stringhelper";
import { useCallback, useContext, useEffect, useState } from "react";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { ResourceCard } from "@/components/feed/resourceitem";
import { JournalsService } from "@/services/apiRepositories/JournalsService";
import { DefaultResourceItemDto } from "@/services/types/defaultResource";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../../styles/components/sections.module.scss";

export interface JournalsSectionProps {
  country?: string;
  region?: string;
  title?: string;
  archive?: string;
  className?: string;
}

export const JournalsSection = ({
  country,
  region,
  title = "Journals",
  archive = "journals",
  className,
}: JournalsSectionProps) => {
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const _service = new JournalsService();
  const { language } = useContext(GlobalContext);
  
  const getJournals = useCallback(async () => {
    setLoading(true);
    try {
      const queryItems = [];
      
      if (country) {
        queryItems.push({
          parameter: "country",
          query: country,
        });
      }
      
      if (region) {
        queryItems.push({
          parameter: "region", 
          query: region,
        });
      }

      const response = await _service.getDefaultResources(
        4,
        0,
        language || "en",
        queryItems.length > 0 ? queryItems : undefined,
        "TMGL"
      );
      
      setItems(response.data);
    } catch (error: any) {
    }
    setLoading(false);
  }, [country, region, language]);

  useEffect(() => {
    getJournals();
  }, [getJournals]);

  return (
    <>
      {items.length > 0 ? (
        <Container size={"xl"} py={80} className={className}>
          {title && items.length > 0 ? (
            <>
              <h2 className={styles.TitleWithIcon}>{capitalizeFirstLetter(title)}</h2>
            </>
          ) : (
            <></>
          )}
          {items?.length > 0 ? (
            <>
              <Flex
                mb={40}
                gap={30}
                direction={{ base: "column", md: "row" }}
                justify={"flex-start"}
                align={"center"}
              >
                {items.map((item, key) => {
                  console.log(item);
                  return (
                    <ResourceCard
                      displayType="column"
                      key={key}
                      link={`/${archive}/${item.id}`}
                      title={
                        item.title
                          ? removeHTMLTagsAndLimit(item.title, 45) +
                            `${item.title.length > 45 ? "..." : ""}`
                          : ""
                      }
                      type={item.year || ""}
                      tags={[
                        ...(item.country
                          ? [
                              {
                                name: item.country,
                                type: "country",
                              },
                            ]
                          : []),
                        ...(item.region
                          ? [
                              {
                                name: item.region,
                                type: "region",
                              },
                            ]
                          : []),
                        ...(Array.isArray(item.thematicArea)
                          ? item.thematicArea
                              .filter((tag) => tag.trim() !== "")
                              .map((tag) => ({
                                name: tag,
                                type: "descriptor",
                              }))
                          : item.thematicArea
                          ? [
                              {
                                name: item.thematicArea,
                                type: "descriptor",
                              },
                            ]
                          : []),
                      ]}
                      excerpt={
                        item.excerpt
                          ? removeHTMLTagsAndLimit(
                              decodeHtmlEntities(item.excerpt),
                              120
                            ) +
                            `${item.excerpt.length > 120 ? "..." : ""}`
                          : "--"
                      }
                    />
                  );
                })}
              </Flex>
            </>
          ) : (
            <></>
          )}
          {items.length > 0 ? (
            <>
              <Link
                href={`/${archive}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "18px",
                }}
              >
                <Flex justify={"flex-start"} align={"center"} gap={10}>
                  <p>Explore more journals</p>
                  <Button p={5} size={"xs"}>
                    <IconArrowRight />
                  </Button>
                </Flex>
              </Link>
            </>
          ) : (
            <></>
          )}
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};

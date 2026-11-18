import { useCallback, useMemo, useContext, useEffect, useState } from "react";
import Image from "next/image";

import { Container, Divider, Flex, Grid } from "@mantine/core";
import { decodeHtmlEntities, parseWpLink } from "@/helpers/stringhelper";

import { GlobalContext } from "@/contexts/globalContext";
import { MenuItemDTO } from "@/services/types/menus.dto";
import { MenusApi } from "@/services/menus/MenusApi";
import styles from "../../styles/components/layout.module.scss";
import { useRouter } from "next/router";

export const FooterLayout = () => {
  const { globalConfig } = useContext(GlobalContext);
  const [footerLeft, setFooterLeft] = useState<MenuItemDTO[]>();
  const [footerRight, setFooterRight] = useState<MenuItemDTO[]>();
  const [footerCenter, setFooterCenter] = useState<MenuItemDTO[]>();
  const menuApi = useMemo(() => new MenusApi(), []);
  const router = useRouter();

  const getFooterMenus = useCallback(async () => {
    try {
      const footerLeftResp = await menuApi.getMenu("footer-left");
      const footerRightResp = await menuApi.getMenu("footer-right");
      const footerCenterResp = await menuApi.getMenu("footer-center");

      setFooterLeft(footerLeftResp);
      setFooterCenter(footerCenterResp);
      setFooterRight(footerRightResp);

      //TODO: FooterRight Bottom
    } catch (err: any) {
    }
  }, [menuApi]);

  const renderMenuItem = (item: MenuItemDTO, index: number) => {
    if (item.children.length > 0) {
      return (
        <div key={index}>
          <p key={index}>{decodeHtmlEntities(item.title)}</p>
          <ul>
            {item.children.map((itemChild, index) => {
              return (
                <li key={index}>
                  <a href={parseWpLink(itemChild.url)}>
                    {decodeHtmlEntities(itemChild.title)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return (
        <a key={index} href={parseWpLink(item.url)}>
          {decodeHtmlEntities(item.title)}
        </a>
      );
    }
  };

  useEffect(() => {
    getFooterMenus();
  }, [getFooterMenus]);

  return (
    <footer>
      <div className={styles.FooterLayout}>
        <Container size={"xl"}>
          <Flex direction={{ base: "column", md: "row" }}>
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={40}
              px={"15px"}
              className={styles.FooterImages}
            >
              {globalConfig?.acf?.footerimages?.map((item, index) => {
                return (
                  <a href={item.url} key={index}>
                    <Flex direction={"column"} justify={"center"} gap={"15px"} align={"flex-start"} className={styles.FooterImageItem}>
                      <Image src={item.image + ".webp"} key={index}  alt="The WHO Traditional Medicine Global Library" width={320} height={160} style={{ height: "auto", width: "50%" }} unoptimized />
                      
                      <span>The WHO Traditional <br/> Medicine Global Library</span>
                    </Flex>
                </a>
                );
              })}
            </Flex>
            <Grid className={styles.FooterMap} px={"25px"} mb={30}>
              <Grid.Col span={{ base: 12, md: 4 }}>
                {footerLeft?.map((item, index) => {
                  return renderMenuItem(item, index);
                })}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                {footerCenter?.map((item, index) => {
                  return renderMenuItem(item, index);
                })}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Flex direction={"column"} justify={"space-between"} gap={20}>
                  <div className={styles.FooterRight}>
                    {footerRight?.map((item, index) => {
                      return renderMenuItem(item, index);
                    })}
                  </div>

                </Flex>
              </Grid.Col>
            </Grid>
          </Flex>
          <Flex
            pt={40}
            pb={10}
            direction={"column"}
            justify={"center"}
            align={"center"}
          >
            <Image src={"/local/png/powered-by-bireme.png"}  alt="Powered by BIREME" width={160} height={60} style={{ height: "auto", width: 160 }} />
            <p className={styles.Copy}>CC BY-NC-SA 3.0 IGO</p>
          </Flex>
        </Container>
      </div>
      <div className={styles.Copyright}>
        <Container size={"xl"}>
          <center>
            <a href={globalConfig?.acf.terms_and_conditions_url}>
              Privacy Policy, Terms, and Conditions of Use
            </a>
          </center>
        </Container>
      </div>
    </footer>
  );
};

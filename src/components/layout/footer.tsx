import { Container, Flex, Grid } from "@mantine/core";
import { decodeHtmlEntities, parseWpLink } from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

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
  const menuApi = new MenusApi();
  const router = useRouter();

  const getFooterMenus = async () => {
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
  };

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
  }, []);

  return (
    <>
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
                    <img src={item.image + ".webp"} key={index} width={"80%"} />
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

                  <div>
                    <p>
                      <a>About Us</a>
                    </p>
                    <p>
                      <a>User Support</a>
                    </p>
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
            <img src={"/local/png/powered-by-bireme.png"} width={"160px"} />
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
    </>
  );
};

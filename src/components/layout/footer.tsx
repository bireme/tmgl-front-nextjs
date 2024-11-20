import { Container, Flex, Grid } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

import { FetchRSSFeed } from "@/services/rss/RssService";
import { GlobalConfigApi } from "@/services/globalConfig/GlobalConfigApi";
import { GlobalContext } from "@/contexts/globalContext";
import { MenuItemDTO } from "@/services/types/menus.dto";
import { MenusApi } from "@/services/menus/MenusApi";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../styles/components/layout.module.scss";

export const FooterLayout = () => {
  const _configApi = new GlobalConfigApi();
  const { setGlobalConfig, globalConfig } = useContext(GlobalContext);
  const [footerLeft, setFooterLeft] = useState<MenuItemDTO[]>();
  const [footerRight, setFooterRight] = useState<MenuItemDTO[]>();
  const [footerCenter, setFooterCenter] = useState<MenuItemDTO[]>();
  const menuApi = new MenusApi();

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
      console.log("Error while fetching footer menus");
    }
  };

  const getGlobalConfig = async () => {
    if (!globalConfig) {
      try {
        const data = await _configApi.getGlobalConfig();
        setGlobalConfig(data);
      } catch (err: any) {
        console.log("Error while fetching global config");
      }
    }
    //TODO : Adicionar configurações globais a um cookie para não realizar a requisição desnecessáriamente.
  };

  const parseWpLink = (wpLink: string) => {
    return wpLink
      .replace(process.env.WP_BASE_URL ? process.env.WP_BASE_URL : "", "")
      .replace("", "");
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
    getGlobalConfig();
  }, []);

  return (
    <>
      <div className={styles.FooterLayout}>
        <Container size={"xl"}>
          <Flex direction={{ base: "column-reverse", md: "row" }}>
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={40}
              px={"15px"}
              className={styles.FooterImages}
            >
              <img src={"/local/png/who.png"} width={"50%"} />
              <img src={"/local/png/who-medicine-center.png"} width={"50%"} />
              <img src={"/local/png/footer-tmgl.png"} width={"100%"} />
            </Flex>
            <Grid className={styles.FooterMap} px={"25px"}>
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
            <p className={styles.Copy}>© WHO (CC BY-NC-SA 4.0)</p>
          </Flex>
        </Container>
      </div>
      <div className={styles.Copyright}>
        <Container size={"xl"}>
          <center>
            <a href={globalConfig?.acf.terms_and_conditions_url}>
              Terms and Conditions of Use
            </a>
            |<a href={globalConfig?.acf.privacy_policy_url}>Privacy Policy</a>
          </center>
        </Container>
      </div>
    </>
  );
};

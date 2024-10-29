/* eslint-disable @next/next/no-img-element */

import { Button, Container, Flex, Grid } from "@mantine/core";
import {
  IconArrowRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconInfoCircle,
  IconLifebuoy,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { MenuItemDTO } from "@/services/types/menus.dto";
import { MenusApi } from "@/services/menus/MenusApi";
import { getRegionName } from "@/helpers/regions";
import styles from "../../styles/components/layout.module.scss";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";

export const HeaderLayout = () => {
  const logoSource = "/local/svg/logo.svg";
  const [isScrolled, setIsScrolled] = useState(false);
  const [opened, setOpened] = useState(false);
  const [globalMenu, setGlobalMenu] = useState<MenuItemDTO[]>();
  const [regMenu, setRegMenu] = useState<MenuItemDTO[]>();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [responsiveMenuOpen, setResponsiveMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemDTO>();
  const [selectedSubItem, setSelectedSubItem] = useState<MenuItemDTO>();
  const [prevSelectedSubItem, setPrevSelectedSubItem] = useState<MenuItemDTO>();
  const router = useRouter();
  const menuApi = new MenusApi();
  const { regionName } = useContext(GlobalContext);
  const mediaQueryMatches = useMediaQuery("(max-width: 750px)");

  const getMenus = async () => {
    const retMenu = await menuApi.getMenu("global-menu");
    const regRetMenu = await menuApi.getMenu("regional-menu");
    setRegMenu(regRetMenu);
    setGlobalMenu(retMenu);
    console.log(retMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePrevMenuItem = () => {
    if (prevSelectedSubItem) {
      setSelectedMenuItem(prevSelectedSubItem);
      setPrevSelectedSubItem(undefined);
    }
  };

  useEffect(() => {
    getMenus();
  }, []);

  return (
    <div
      className={`${styles.HeaderContent} ${
        isScrolled ? styles.scrolled : ""
      } ${opened ? styles.Opened : ""}`}
    >
      <Container size={"xl"}>
        <Flex
          gap={"10px"}
          direction={"row"}
          align={"center"}
          justify={"center"}
          className={styles.LogoContainer}
        >
          <Flex direction={"column"}>
            <a href={"/"}>
              <img src={logoSource} alt="brand-logo" id={"BrandLogo"} />
            </a>
          </Flex>
          <Flex
            direction={"column"}
            justify={"center"}
            className={styles.BrandContent}
          >
            <Flex
              direction={"row"}
              justify={"space-between"}
              align={"center"}
              className={`${styles.SuperiorFlex} ${
                getRegionName(regionName) ? styles.HasRegion : ""
              }`}
            >
              <a href={"/"}>
                <p>
                  TMGL <span>{getRegionName(regionName)}</span>
                </p>
              </a>
              <div className={styles.ResponsiveMenuButton}>
                {!responsiveMenuOpen ? (
                  <>
                    <IconMenu2
                      size={25}
                      stroke={1.5}
                      onClick={() => setResponsiveMenuOpen(true)}
                    />
                  </>
                ) : (
                  <>
                    <IconX
                      size={25}
                      stroke={1.5}
                      onClick={() => {
                        setResponsiveMenuOpen(false);
                        setMegaMenuOpen(false);
                      }}
                    />
                  </>
                )}
              </div>
              <div
                className={`${styles.SuperiorLinks} ${
                  opened || !isScrolled ? styles.Opened : ""
                }`}
              >
                {globalMenu?.map((item, key) => {
                  return (
                    <a
                      key={key}
                      onClick={() => {
                        setMegaMenuOpen(true);
                        setSelectedMenuItem(item);
                        setSelectedSubItem(undefined);
                      }}
                    >
                      {item.title == "About Us" ? (
                        <IconInfoCircle size={25} stroke={1} />
                      ) : (
                        <IconLifebuoy size={25} stroke={1} />
                      )}

                      {item.title}
                    </a>
                  );
                })}
              </div>
              {isScrolled ? (
                <a
                  className={styles.ScrolledButton}
                  onClick={() => setOpened(opened ? false : true)}
                >
                  {opened ? <IconX /> : <IconMenu2 />}
                </a>
              ) : (
                <></>
              )}
            </Flex>

            <Flex
              mt={0}
              className={`${styles.InfoNavContainer} ${
                opened ? styles.Opened : ""
              }`}
              justify={"space-between"}
            >
              <a href={"/"}>
                <small>The WHO Traditional Medicine Global Library</small>
              </a>
              <Flex className={styles.InfoNav} justify={"fle-end"} gap={"16px"}>
                {regMenu?.map((item, key) => {
                  return (
                    <a
                      onClick={() => {
                        if (item.children?.length > 0) {
                          setMegaMenuOpen(true);
                          setSelectedMenuItem(item);
                          setSelectedSubItem(undefined);
                        } else {
                          if (item.url) {
                            router.push(item.url);
                          }
                        }
                      }}
                      key={key}
                    >
                      {decodeHtmlEntities(item.title ? item.title : "")}
                    </a>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Container>
      {megaMenuOpen ? (
        <div
          className={`${styles.MegaMenuOverlay} ${styles.Main}`}
          onClick={() => setMegaMenuOpen(false)}
        >
          <div
            className={styles.MegaMenu}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <h2
                  style={{
                    cursor: prevSelectedSubItem ? "pointer" : "default",
                  }}
                  onClick={() => {
                    handlePrevMenuItem();
                  }}
                >
                  {prevSelectedSubItem ? (
                    <>
                      <IconChevronsLeft />
                    </>
                  ) : (
                    <></>
                  )}
                  {decodeHtmlEntities(
                    selectedMenuItem?.title ? selectedMenuItem.title : ""
                  )}
                </h2>
                <nav>
                  {selectedMenuItem?.children.map((item, key) => {
                    return (
                      <a
                        key={key}
                        onClick={() => {
                          if (item.children.length > 0) {
                            setPrevSelectedSubItem(selectedMenuItem);
                            setSelectedMenuItem(item);
                            setSelectedSubItem(item.children[0]);
                          } else {
                            setSelectedSubItem(item);
                            //If the site is being displayed at a phone this need to act lile a link
                            if (mediaQueryMatches) {
                              router.push(item.url);
                              setMegaMenuOpen(false);
                              setResponsiveMenuOpen(false);
                            }
                          }
                        }}
                        className={`${
                          selectedSubItem?.ID == item.ID ? styles.selected : ""
                        }`}
                      >
                        {decodeHtmlEntities(item.title ? item.title : "")}
                        {selectedSubItem?.ID == item.ID ? (
                          <div>
                            <IconChevronsRight />
                          </div>
                        ) : (
                          <></>
                        )}
                      </a>
                    );
                  })}
                </nav>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, md: 8 }}
                className={styles.MegaMenuRightSection}
              >
                <Flex
                  justify={"center"}
                  align={"center"}
                  style={{ height: "100%" }}
                >
                  {selectedSubItem ? (
                    !selectedSubItem.description ||
                    selectedSubItem.description == "" ? (
                      <>
                        {selectedSubItem.attr ? (
                          <>
                            <img
                              alt={"menun-image"}
                              width={"100%"}
                              src={`${process.env.WP_BASE_URL}${selectedSubItem.attr}`}
                              className={styles.SelectedMenuItemFullImage}
                            />
                            <a
                              onClick={() => {}}
                              href={selectedSubItem.url}
                              className={styles.FullImageSubItembBtn}
                            >
                              <Button>
                                {decodeHtmlEntities(selectedSubItem.title)}{" "}
                                Portal
                              </Button>
                            </a>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <Grid mt={40}>
                          <Grid.Col span={{ base: 12, md: 4 }}>
                            <img
                              alt={"menu-image"}
                              src={`${process.env.WP_BASE_URL}${selectedSubItem.attr}`}
                              width={"100%"}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 8 }}>
                            <div className={styles.halfImageContainer}>
                              <div className={styles.halfImagetext}>
                                {selectedSubItem.description}
                              </div>
                              <a
                                className={styles.HalfImageSubItembBtn}
                                href={selectedSubItem?.url}
                              >
                                <Button mt={15}>
                                  Explore{" "}
                                  {removeHTMLTagsAndLimit(
                                    selectedSubItem.title,
                                    20
                                  )}
                                  {selectedSubItem.title.length > 20
                                    ? "..."
                                    : ""}
                                  <IconArrowRight stroke={1.5} />
                                </Button>
                              </a>
                            </div>
                          </Grid.Col>
                        </Grid>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </div>
        </div>
      ) : (
        <></>
      )}

      {responsiveMenuOpen ? (
        <div
          className={styles.MegaMenuOverlay}
          onClick={() => {
            setMegaMenuOpen(false);
            setResponsiveMenuOpen(false);
          }}
        >
          <div className={styles.ResponsiveMenu}>
            <nav>
              {regMenu?.map((item, key) => {
                return (
                  <a
                    onClick={(e) => {
                      if (item.children?.length > 0) {
                        e.stopPropagation();
                        setMegaMenuOpen(true);
                        setSelectedMenuItem(item);
                        setSelectedSubItem(undefined);
                      } else {
                        if (item.url) {
                          router.push(item.url);
                        }
                      }
                    }}
                    key={key}
                  >
                    {megaMenuOpen ? <>teste</> : <></>}
                    {decodeHtmlEntities(item.title ? item.title : "")}
                  </a>
                );
              })}
              <hr />
            </nav>
            <nav className={styles.secondNav}>
              {globalMenu?.map((item, key) => {
                return (
                  <a
                    key={key}
                    onClick={() => {
                      setMegaMenuOpen(true);
                      setSelectedMenuItem(item);
                      setSelectedSubItem(undefined);
                    }}
                  >
                    {item.title}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export const FooterLayout = () => {
  return (
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
              <p>Regions</p>
              <ul>
                <li>Africa</li>
                <li>Americas</li>
                <li>Europe</li>
                <li>Eastern Mediterranean</li>
                <li>South-East Asia</li>
                <li>Western Pacific</li>
              </ul>
              <p>Countries</p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <p>Dimensions</p>
              <ul>
                <li>Health & Well-being</li>
                <li>Leadership & Policies</li>
                <li>Research & Evidence</li>
                <li>Health Systems & Services</li>
                <li>Digital Health Frontiers</li>
                <li>Biodiversity & Sustainability</li>
                <li>Rights, Equity & Ethics</li>
                <li>TM for Daily Life</li>
              </ul>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Flex direction={"column"} justify={"space-between"} gap={20}>
                <div>
                  <p>
                    <b>Trending Topics</b>
                  </p>
                  <p>
                    <b>Featured Stories</b>
                  </p>
                  <p>
                    <b>Events</b>
                  </p>
                  <p>
                    <b>News</b>
                  </p>
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
        <Flex py={40} direction={"column"} justify={"center"} align={"center"}>
          <img src={"/local/png/powered-by-bireme.png"} width={"160px"} />
          <p className={styles.Copy}>© All rights reserved</p>
        </Flex>
      </Container>
    </div>
  );
};

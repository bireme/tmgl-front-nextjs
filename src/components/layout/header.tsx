/* eslint-disable @next/next/no-img-element */

import { Button, Container, Flex, Grid, stylesToString } from "@mantine/core";
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
  parseWpLink,
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
  const { regionName, countryName } = useContext(GlobalContext);
  const mediaQueryMatches = useMediaQuery("(max-width: 750px)");

  const getMenus = async () => {
    const retMenu = await menuApi.getMenu("global-menu");
    const regRetMenu = await menuApi.getMenu("regional-menu");
    setRegMenu(regRetMenu);
    setGlobalMenu(retMenu);
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

  const renderMegaMenuWithItems = () => {
    return (
      <div
        className={styles.MegaMenuContainerWithItems}
        style={{
          backgroundImage: `url(${process.env.WP_BASE_URL}${selectedSubItem?.attr})`,
        }}
      >
        {renderSubItemsNav(true)}
      </div>
    );
  };

  const renderSubItemsSubNav = (prev?: boolean) => {
    return prevSelectedSubItem?.children.map((item, key) => {
      return (
        <a
          key={key}
          onClick={() => {
            if (prev) {
              router.push(item.url);
              handleCloseMegaMenu();
            } else {
              if (item.children.length > 0) {
                setPrevSelectedSubItem(selectedMenuItem);
                setSelectedMenuItem(item);
                setSelectedSubItem(item.children[0]);
              } else {
                setSelectedSubItem(item);
                //If the site is being displayed at a phone this need to act lile a link
                if (mediaQueryMatches) {
                  router.push(item.url);
                  handleCloseMegaMenu();
                  setResponsiveMenuOpen(false);
                }
              }
            }
          }}
          className={`${
            selectedSubItem?.parent == item.ID && !prev ? styles.selected : ""
          }`}
        >
          {decodeHtmlEntities(item.title ? item.title : "")}
          {selectedSubItem?.parent == item.ID && !prev ? (
            <div>
              <IconChevronsRight />
            </div>
          ) : (
            <></>
          )}
        </a>
      );
    });
  };

  const handleCloseMegaMenu = () => {
    setMegaMenuOpen(false);
    setResponsiveMenuOpen(false);
    setSelectedMenuItem(undefined);
    setSelectedSubItem(undefined);
    setPrevSelectedSubItem(undefined);
  };

  const renderSubItemsNav = (prev?: boolean) => {
    return selectedMenuItem?.children.map((item, key) => {
      return (
        <a
          key={key}
          onClick={() => {
            if (prev) {
              router.push(item.url);
              handleCloseMegaMenu();
            } else {
              if (item.children.length > 0) {
                setPrevSelectedSubItem(selectedMenuItem);
                setSelectedMenuItem(item);
                setSelectedSubItem(item.children[0]);
              } else {
                setSelectedSubItem(item);
                //If the site is being displayed at a phone this need to act lile a link
                if (mediaQueryMatches) {
                  router.push(item.url);
                  handleCloseMegaMenu();
                  setResponsiveMenuOpen(false);
                }
              }
            }
          }}
          className={`${
            selectedSubItem?.ID == item.ID && !prev ? styles.selected : ""
          }`}
        >
          {decodeHtmlEntities(item.title ? item.title : "")}
          {selectedSubItem?.ID == item.ID && !prev ? (
            <div>
              <IconChevronsRight />
            </div>
          ) : (
            <></>
          )}
        </a>
      );
    });
  };

  const renderMegaMenuItem = (selectedSubItem: MenuItemDTO) => {
    if (!selectedSubItem.description || selectedSubItem.description == "") {
      return (
        <>
          <img
            alt={"menu-image"}
            width={selectedSubItem.attr ? "100%" : "20%"}
            src={
              selectedSubItem.attr
                ? `${process.env.WP_BASE_URL}${selectedSubItem.attr}`
                : "/local/png/defaultimage.png"
            }
            className={styles.SelectedMenuItemFullImage}
          />{" "}
          <a
            onClick={() => {}}
            href={parseWpLink(selectedSubItem.url)}
            className={styles.FullImageSubItembBtn}
          >
            <Button>{decodeHtmlEntities(selectedSubItem.title)} Portal</Button>
          </a>
        </>
      );
    } else {
      return (
        <>
          <Grid mt={0}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <img
                alt={"menu-image"}
                width={selectedSubItem.attr ? "100%" : "20%"}
                src={
                  selectedSubItem.attr
                    ? `${process.env.WP_BASE_URL}${selectedSubItem.attr}`
                    : "/local/png/defaultimage.png"
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div className={styles.halfImageContainer}>
                <div className={styles.halfImagetext}>
                  {selectedSubItem.description}
                </div>
                <a
                  className={styles.HalfImageSubItembBtn}
                  href={parseWpLink(selectedSubItem?.url)}
                >
                  <Button mt={15}>
                    Explore {removeHTMLTagsAndLimit(selectedSubItem.title, 20)}
                    {selectedSubItem.title.length > 20 ? "..." : ""}
                    <IconArrowRight stroke={1.5} />
                  </Button>
                </a>
              </div>
            </Grid.Col>
          </Grid>
        </>
      );
    }
  };

  return (
    <div
      className={`${styles.HeaderContent} ${
        isScrolled ? styles.scrolled : ""
      } ${opened ? styles.Opened : ""}`}
    >
      <Container size={"xl"}>
        {isScrolled ? (
          <div className={styles.HeaderActionContainer}>
            <div
              className={`${styles.HeaderActionButton} ${
                !opened ? styles.HeaderActionOpened : ""
              } `}
            >
              <a
                className={styles.ScrolledButton}
                onClick={() => {
                  setOpened(opened ? false : true);
                }}
              >
                {opened ? <IconX /> : <IconMenu2 />}
              </a>
            </div>
          </div>
        ) : (
          <></>
        )}
        <Flex
          gap={"10px"}
          direction={"row"}
          align={"center"}
          justify={"center"}
          className={styles.LogoContainer}
        >
          <Flex direction={"column"}>
            <a href={`/`}>
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
              <a href={`/${regionName ? regionName : ""}`}>
                <p>
                  TMGL{" "}
                  <span>
                    {countryName ? countryName : getRegionName(regionName)}
                  </span>
                </p>
              </a>
              <div className={styles.ResponsiveMenuButton}>
                {!responsiveMenuOpen ? (
                  <>
                    <IconMenu2
                      size={25}
                      stroke={1.5}
                      onClick={() => {
                        setResponsiveMenuOpen(true);
                        handleCloseMegaMenu();
                      }}
                    />
                  </>
                ) : (
                  <>
                    <IconX
                      size={25}
                      stroke={1.5}
                      onClick={() => {
                        setResponsiveMenuOpen(false);
                        handleCloseMegaMenu();
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
                        if (selectedMenuItem?.ID == item.ID) {
                          handleCloseMegaMenu();
                          setSelectedMenuItem(undefined);
                        } else {
                          setMegaMenuOpen(true);
                          setSelectedMenuItem(item);
                          setSelectedSubItem(undefined);
                        }
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
            </Flex>

            <Flex
              mt={0}
              className={`${styles.InfoNavContainer} ${
                opened ? styles.Opened : ""
              }`}
              justify={"space-between"}
            >
              <a href={`/${regionName ? regionName : ""}`}>
                <small>The WHO Traditional Medicine Global Library</small>
              </a>
              <Flex className={styles.InfoNav} justify={"fle-end"} gap={"16px"}>
                {regMenu?.map((item, key) => {
                  return (
                    <a
                      onClick={() => {
                        if (item.children?.length > 0) {
                          if (selectedMenuItem?.ID == item.ID) {
                            handleCloseMegaMenu();
                            setSelectedMenuItem(undefined);
                          } else {
                            setMegaMenuOpen(true);
                            setSelectedMenuItem(item);
                            setSelectedSubItem(undefined);
                          }
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
          onClick={() => handleCloseMegaMenu()}
        >
          <div
            className={styles.MegaMenu}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Grid>
              <Grid.Col span={5}>
                <h2
                  style={{
                    cursor: prevSelectedSubItem ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
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
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <nav>
                  {prevSelectedSubItem
                    ? renderSubItemsSubNav()
                    : renderSubItemsNav()}
                </nav>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, md: 8 }}
                className={styles.MegaMenuRightSection}
              >
                <Flex mt={20} style={{ height: "100%" }}>
                  {selectedSubItem ? (
                    prevSelectedSubItem ? (
                      renderMegaMenuWithItems()
                    ) : (
                      renderMegaMenuItem(selectedSubItem)
                    )
                  ) : selectedMenuItem?.children[0] ? (
                    prevSelectedSubItem ? (
                      renderMegaMenuWithItems()
                    ) : (
                      renderMegaMenuItem(selectedMenuItem?.children[0])
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
            handleCloseMegaMenu();
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
                        setResponsiveMenuOpen(false);
                      } else {
                        if (item.url) {
                          router.push(parseWpLink(item.url));
                        }
                      }
                    }}
                    key={key}
                  >
                    {megaMenuOpen ? <></> : <></>}
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
                    onClick={(e) => {
                      if (item.children?.length > 0) {
                        e.stopPropagation();
                        setMegaMenuOpen(true);
                        setSelectedMenuItem(item);
                        setSelectedSubItem(undefined);
                        setResponsiveMenuOpen(false);
                      } else {
                        if (item.url) {
                          router.push(parseWpLink(item.url));
                        }
                      }
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

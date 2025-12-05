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
  const [originalMenuItem, setOriginalMenuItem] = useState<MenuItemDTO>();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [responsiveMenuOpen, setResponsiveMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemDTO>();
  const [selectedSubItem, setSelectedSubItem] = useState<MenuItemDTO>();
  const [thirdLevelItems, setThirdLevelItems] = useState<MenuItemDTO[]>();
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
      // Desativa o comportamento de scroll no responsivo (max-width: 1024px)
      if (window.innerWidth <= 1024) {
        setIsScrolled(false);
        return;
      }
      
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    // Também verifica no resize da janela
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsScrolled(false);
      } else {
        handleScroll();
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    // Verifica no carregamento inicial
    handleResize();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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

  // Impede scroll do body quando menu responsivo estiver aberto
  useEffect(() => {
    if (responsiveMenuOpen || megaMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup quando componente desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [responsiveMenuOpen, megaMenuOpen]);

  const renderMegaMenuWithItems = () => {
    return (
      <div
        className={styles.MegaMenuContainerWithItems}
        style={{
          backgroundImage: `url(${process.env.WP_BASE_URL}${selectedSubItem?.attr})`,
        }}
      >
        <div className={styles.InternalItemsWrapper}>
          {thirdLevelItems?.map((item, key) => {
            return (
              <a
                className={styles.InternalItem}
                href={parseWpLink(item ? item.url : "")}
                key={key}
              >
                {decodeHtmlEntities(item.title)}
              </a>
            );
          })}
        </div>
        <a
          onClick={() => {}}
          href={parseWpLink(selectedSubItem ? selectedSubItem.url : "")}
          className={styles.FullImageSubItembBtn}
        >
          <Button>
            {decodeHtmlEntities(selectedSubItem ? selectedSubItem.title : "")}{" "}
            Portal
          </Button>
        </a>
      </div>
    );
  };

  const handleCloseMegaMenu = () => {
    setMegaMenuOpen(false);
    setResponsiveMenuOpen(false);
    setSelectedMenuItem(undefined);
    setSelectedSubItem(undefined);
    setPrevSelectedSubItem(undefined);
  };

  const renderSubItemsNav = (prev?: boolean) => {
    const toIterate =
      selectedMenuItem?.children.length != 0 && !prevSelectedSubItem
        ? selectedMenuItem?.children
        : prevSelectedSubItem?.children;
    return toIterate?.map((item, key) => {
      return (
        <a
          key={key}
          href={'#'}
          onClick={(e) => {
            if (prev) {
              e.preventDefault();
              router.push(parseWpLink(item.url));
              handleCloseMegaMenu();
            } else {
              if (item.children.length > 0) {
                e.preventDefault();
                setThirdLevelItems(item.children);
                setSelectedSubItem(item);
              } else {
                setThirdLevelItems(undefined);
                setSelectedSubItem(item);
                if (mediaQueryMatches) {
                  e.preventDefault();
                  router.push(parseWpLink(item.url));
                  handleCloseMegaMenu();
                  setResponsiveMenuOpen(false);
                }
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (prev) {
                router.push(parseWpLink(item.url));
                handleCloseMegaMenu();
              } else {
                if (item.children.length > 0) {
                  setThirdLevelItems(item.children);
                  setSelectedSubItem(item);
                } else {
                  setThirdLevelItems(undefined);
                  setSelectedSubItem(item);
                  if (mediaQueryMatches) {
                    router.push(parseWpLink(item.url));
                    handleCloseMegaMenu();
                    setResponsiveMenuOpen(false);
                  }
                }
              }
            }
          }}
          className={`${
            selectedSubItem?.ID == item.ID && !prev ? styles.selected : ""
          }`}
          aria-haspopup={item.children.length > 0 ? "true" : undefined}
          aria-expanded={item.children.length > 0 && selectedSubItem?.ID == item.ID && !prev ? true : undefined}
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
            src={
              selectedSubItem.attr
                ? `${process.env.WP_BASE_URL}${selectedSubItem.attr}`
                : "/local/png/defaultimage.png"
            }
            className={`${styles.SelectedMenuItemFullImage} ${selectedSubItem.attr ? styles.selectedSubItem  : ""}`}
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
                src={
                  selectedSubItem.attr
                    ? `${process.env.WP_BASE_URL}${selectedSubItem.attr}`
                    : "/local/png/defaultimage.png"
                }
                className={`${styles.SelectedMenuItemFullImage} ${selectedSubItem.attr ? styles.selectedSubItem  : ""}`}
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
    <header className={styles.Header}>
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
                <button
                  className={styles.ScrolledButton}
                  onClick={() => {
                    setOpened(opened ? false : true);
                  }}
                  aria-expanded={opened}
                  aria-label="Toggle menu"
                  aria-controls="main-navigation"
                  type="button"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    margin: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'inherit',
                    font: 'inherit'
                  }}
                >
                  {opened ? <IconX /> : <IconMenu2 />}
                </button>
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
            <Flex direction={"row"} align={"center"} className={styles.LogoContent} gap={"10px"}>
              <div>
                <a href={`/`}>
                  <img src={logoSource} alt="brand-logo" id={"BrandLogo"} />
                </a>
              </div>
              <Flex className={styles.LogoTextContent} direction={"column"} justify={"flex-end"} align={"flex-start"}>
                <a className={styles.LogoRegionNameText} href={`/${regionName ? regionName : ""}`}>
                  {countryName ? countryName : getRegionName(regionName)}
                </a>
                <a href={`/${regionName ? regionName : ""}`} className={styles.LogoSubText}>
                  {
                    countryName || getRegionName(regionName) ? (
                      <small>The WHO Traditional <br/> Medicine Global Library</small>
                    ) : (
                      <>The WHO Traditional <br/> Medicine Global Library</>
                    )
                  }
                  
                </a>
              </Flex>
            </Flex>
            <Flex
              direction={"column"}
              justify={"center"}
              className={styles.BrandContent}
            >
              <Flex
                direction={"row"}
                justify={"flex-end"}
                align={"center"}
                className={`${styles.SuperiorFlex} ${
                  getRegionName(regionName) ? styles.HasRegion : ""
                }`}
              >
                <div className={styles.ResponsiveMenuButton}>
                  <button
                    onClick={() => {
                      if (responsiveMenuOpen) {
                        setResponsiveMenuOpen(false);
                        handleCloseMegaMenu();
                      } else {
                        setResponsiveMenuOpen(true);
                      }
                    }}
                    aria-expanded={responsiveMenuOpen}
                    aria-label="Menu"
                    aria-controls="responsive-navigation"
                    type="button"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: 0, 
                      margin: 0,
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                  >
                    {!responsiveMenuOpen ? (
                      <IconMenu2
                        size={25}
                        stroke={1.5}
                      />
                    ) : (
                      <IconX
                        size={25}
                        stroke={1.5}
                      />
                    )}
                  </button>
                </div>
                <div
                  id="main-navigation"
                  className={`${styles.SuperiorLinks} ${
                    opened || !isScrolled ? styles.Opened : ""
                  }`}
                >
                  {globalMenu?.map((item, key) => {
                    return (
                      <a
                        key={key}
                        href={item.children?.length > 0 ? "#" : parseWpLink(item.url)}
                        onClick={(e) => {
                          if (item.children?.length > 0) {
                            e.preventDefault();
                            if (selectedMenuItem?.ID == item.ID) {
                              handleCloseMegaMenu();
                              setSelectedMenuItem(undefined);
                            } else {
                              setMegaMenuOpen(true);
                              setOriginalMenuItem(item);
                              setSelectedMenuItem(item);
                              setSelectedSubItem(undefined);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (item.children?.length > 0) {
                              if (selectedMenuItem?.ID == item.ID) {
                                handleCloseMegaMenu();
                                setSelectedMenuItem(undefined);
                              } else {
                                setMegaMenuOpen(true);
                                setOriginalMenuItem(item);
                                setSelectedMenuItem(item);
                                setSelectedSubItem(undefined);
                              }
                            }
                          }
                        }}
                        aria-haspopup={item.children?.length > 0 ? "true" : undefined}
                        aria-expanded={item.children?.length > 0 && selectedMenuItem?.ID == item.ID ? true : undefined}
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
              <nav>
                <Flex
                  mt={0}
                  className={`${styles.InfoNavContainer} ${
                    opened ? styles.Opened : ""
                  }`}
                  align={"flex-end"}
                  justify={"flex-end"}
                >
                  
                  <Flex className={styles.InfoNav} justify={"fle-end"} gap={"16px"}>
                    {regMenu?.map((item, key) => {
                      return (
                        <a
                          href={item.children?.length > 0 ? "#" : parseWpLink(item.url)}
                          onClick={(e) => {
                            if (item.children?.length > 0) {
                              e.preventDefault();
                              if (selectedMenuItem?.ID == item.ID) {
                                handleCloseMegaMenu();
                                setSelectedMenuItem(undefined);
                              } else {
                                setMegaMenuOpen(true);
                                setOriginalMenuItem(item);
                                setSelectedMenuItem(item);
                                setSelectedSubItem(undefined);
                              }
                            } else {
                              e.preventDefault();
                              if (item.url) {
                                router.push(parseWpLink(item.url));
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (item.children?.length > 0) {
                                if (selectedMenuItem?.ID == item.ID) {
                                  handleCloseMegaMenu();
                                  setSelectedMenuItem(undefined);
                                } else {
                                  setMegaMenuOpen(true);
                                  setOriginalMenuItem(item);
                                  setSelectedMenuItem(item);
                                  setSelectedSubItem(undefined);
                                }
                              } else {
                                if (item.url) {
                                  router.push(parseWpLink(item.url));
                                }
                              }
                            }
                          }}
                          key={key}
                          aria-haspopup={item.children?.length > 0 ? "true" : undefined}
                          aria-expanded={item.children?.length > 0 && selectedMenuItem?.ID == item.ID ? true : undefined}
                        >
                          {decodeHtmlEntities(item.title ? item.title : "")}
                        </a>
                      );
                    })}
                  </Flex>
                </Flex>
              </nav>
              
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
              <Grid style={{ flexShrink: 0 }}>
                <Grid.Col span={{ base: 12, md: 5 }}>
                  {prevSelectedSubItem ? (
                    <button
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        font: "inherit",
                        color: "inherit",
                        textAlign: "left",
                        width: "100%"
                      }}
                      onClick={() => {
                        handlePrevMenuItem();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePrevMenuItem();
                        }
                      }}
                      aria-label="Go back to previous menu"
                      type="button"
                    >
                      <h2 style={{ display: "flex", alignItems: "center", margin: 0 }}>
                        <IconChevronsLeft />
                        {decodeHtmlEntities(
                          selectedMenuItem?.title ? selectedMenuItem.title : ""
                        )}
                      </h2>
                    </button>
                  ) : (
                    <h2>
                      {decodeHtmlEntities(
                        selectedMenuItem?.title ? selectedMenuItem.title : ""
                      )}
                    </h2>
                  )}
                </Grid.Col>
              </Grid>

              <Grid style={{ flex: 1}}>
                <Grid.Col span={{ base: 12, md: 4 }} style={{ height: "100%" }}>
                  <nav>{renderSubItemsNav()}</nav>
                </Grid.Col>
                <Grid.Col
                  span={{ base: 12, md: 8 }}
                    
                  className={styles.MegaMenuRightSection}
                >
                  <Flex mt={20} style={{ height: "100%" }} direction={"column"}>
                    {selectedSubItem
                      ? thirdLevelItems
                        ? renderMegaMenuWithItems()
                        : renderMegaMenuItem(selectedSubItem)
                      : selectedMenuItem?.children[0]
                      ? renderMegaMenuItem(selectedMenuItem?.children[0])
                      : ""}
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
            <div id="responsive-navigation" className={styles.ResponsiveMenu}>
              <nav>
                {regMenu?.map((item, key) => {
                  return (
                    <a
                      href={item.children?.length > 0 ? "#" : parseWpLink(item.url)}
                      onClick={(e) => {
                        if (item.children?.length > 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          setMegaMenuOpen(true);
                          setOriginalMenuItem(item);
                          setSelectedMenuItem(item);
                          setSelectedSubItem(undefined);
                          setResponsiveMenuOpen(false);
                        } else {
                          e.preventDefault();
                          if (item.url) {
                            router.push(parseWpLink(item.url));
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (item.children?.length > 0) {
                            e.stopPropagation();
                            setMegaMenuOpen(true);
                            setOriginalMenuItem(item);
                            setSelectedMenuItem(item);
                            setSelectedSubItem(undefined);
                            setResponsiveMenuOpen(false);
                          } else {
                            if (item.url) {
                              router.push(parseWpLink(item.url));
                            }
                          }
                        }
                      }}
                      key={key}
                      aria-haspopup={item.children?.length > 0 ? "true" : undefined}
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
                      href={item.children?.length > 0 ? "#" : parseWpLink(item.url)}
                      onClick={(e) => {
                        if (item.children?.length > 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          setMegaMenuOpen(true);
                          setSelectedMenuItem(item);
                          setSelectedSubItem(undefined);
                          setResponsiveMenuOpen(false);
                        } else {
                          e.preventDefault();
                          if (item.url) {
                            router.push(parseWpLink(item.url));
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
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
                        }
                      }}
                      aria-haspopup={item.children?.length > 0 ? "true" : undefined}
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
    </header>
  );
};

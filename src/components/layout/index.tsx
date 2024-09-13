/* eslint-disable @next/next/no-img-element */

import { Container, Flex } from "@mantine/core";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import styles from "../../styles/components/layout.module.scss";

export const HeaderLayout = () => {
  const logoSource = "/local/svg/logo.svg";
  const [isScrolled, setIsScrolled] = useState(false);
  const [opened, setOpened] = useState(false);

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

  return (
    <div
      className={`${styles.HeaderContent} ${
        isScrolled ? styles.scrolled : ""
      } ${opened ? styles.Opened : ""}`}
    >
      <Container size={"xl"}>
        <Flex
          gap={"9px"}
          direction={"row"}
          align={"center"}
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
              className={styles.SuperiorFlex}
            >
              <a href={"/"}>
                <p>TMGL</p>
              </a>
              {isScrolled ? (
                <a onClick={() => setOpened(opened ? false : true)}>
                  {opened ? <IconX /> : <IconMenu2 />}
                </a>
              ) : (
                <></>
              )}
            </Flex>

            <Flex
              className={`${styles.InfoNavContainer} ${
                opened ? styles.Opened : ""
              }`}
              justify={"space-between"}
            >
              <a href={"/"}>
                <small>The WHO Traditional Medicine Global Library</small>
              </a>
              <Flex className={styles.InfoNav} justify={"fle-end"} gap={"16px"}>
                <a>Regions & Countries</a>
                <a>About Us </a>
                <a>User Support</a>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Container>
      <SubNav opened={opened} />
    </div>
  );
};

export interface SubNavProps {
  opened: boolean;
}
export const SubNav = ({ opened }: SubNavProps) => {
  return (
    <div className={`${styles.SubNav} ${opened ? styles.Opened : ""}`}>
      <Container size={"xl"}>
        <nav>
          <a>Health & Well-being</a>
          <a>Leadership & Policies</a>
          <a>Research & Evidence</a>
          <a>Health Systems & Services</a>
          <a> Digital Health Frontiers</a>
          <a>Biodiversity & Sustainability</a>
          <a>Rights, Equity & Ethics</a>
          <a>TM for Daily Life</a>
        </nav>
      </Container>
    </div>
  );
};

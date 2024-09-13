/* eslint-disable @next/next/no-img-element */
import { Container, Flex } from "@mantine/core";
import { useEffect, useState } from "react";

import styles from "../../styles/components/layout.module.scss";

export const HeaderLayout = () => {
  const logoSource = "/local/svg/logo.svg";

  const [isScrolled, setIsScrolled] = useState(false);
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
      className={`${styles.HeaderContent} ${isScrolled ? styles.scrolled : ""}`}
    >
      <Container size={"xl"}>
        <Flex
          gap={"9px"}
          direction={"row"}
          align={"center"}
          className={styles.LogoContainer}
        >
          <Flex>
            <a href={"/"}>
              <img src={logoSource} alt="brand-logo" id={"BrandLogo"} />
            </a>
          </Flex>
          <Flex
            direction={"column"}
            justify={"center"}
            className={styles.BrandContent}
          >
            <a href={"/"}>
              <p>TMGL</p>
            </a>

            <Flex className={styles.InfoNavContainer} justify={"space-between"}>
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
      <SubNav />
    </div>
  );
};

export const SubNav = () => {
  return (
    <div className={styles.SubNav}>
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

import { Container, Flex, Grid } from "@mantine/core";
import { useContext, useEffect } from "react";

import { GlobalConfigApi } from "@/services/globalConfig/GlobalConfigApi";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/components/layout.module.scss";

export const FooterLayout = () => {
  const _configApi = new GlobalConfigApi();
  const { setGlobalConfig, globalConfig } = useContext(GlobalContext);

  const getGlobalConfig = async () => {
    if (!globalConfig) {
      try {
        const data = await _configApi.getGlobalConfig();
        setGlobalConfig(data);
        console.log(data);
      } catch (err: any) {
        console.log("Error while fetching global config");
      }
    }
    //TODO : Adicionar configurações globais a um cookie para não realizar a requisição desnecessáriamente.
  };

  useEffect(() => {
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

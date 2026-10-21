import { Flex } from "@mantine/core";
import { useRegionalMenu } from "@/hooks/useRegionalMenu";
import { regionalCountries } from "@/helpers/regionalCountries";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import type { HomeAcf } from "@/services/types/homeAcf.dto";
import { RegionalDimensions } from "../dimensions";
import styles from "../../../styles/components/sections.module.scss";

export function RegionalCountries({ region, acf }: { region: string; acf: HomeAcf }) {
  const { data: menu } = useRegionalMenu();
  const countries = menu ? regionalCountries(menu, region) : [];

  if (acf.tmd?.dimensions?.length) {
    return <RegionalDimensions acf={acf} region={region} />;
  }

  return (
    <RegionalDimensions acf={acf} region={region}>
      {countries.map((country) => (
        <Flex
          key={country.id}
          component="a"
          href={country.href}
          className={styles.CountryLink}
          justify="center"
          align="center"
          direction="column"
        >
          {decodeHtmlEntities(country.title)}
        </Flex>
      ))}
    </RegionalDimensions>
  );
}

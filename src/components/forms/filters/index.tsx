import { Button, Checkbox, Input } from "@mantine/core";
import { IconArrowUp, IconChevronCompactUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { PostsApi } from "@/services/posts/PostsApi";
import { TaxonomyTermDTO } from "@/services/types/taxonomies.dto";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/components/forms.module.scss";
import { useForm } from "@mantine/form";

export const FiltersForm = () => {
  const form = useForm({
    initialValues: {
      dimensions: [""],
    },
  });
  const _api = new PostsApi();
  const [dimensions, setDimensions] = useState<TaxonomyTermDTO[]>();
  const [countries, setCountries] = useState<TaxonomyTermDTO[]>();
  const [regions, setRegions] = useState<TaxonomyTermDTO[]>();

  const getTaxonomies = async () => {
    const taxData = await _api.getTaxonomiesBySlug("tm-dimension");
    const countrieData = await _api.getTaxonomiesBySlug("country");
    const regionData = await _api.getTaxonomiesBySlug("region");

    setCountries(countrieData);
    setRegions(regionData);
    setDimensions(taxData);
  };

  useEffect(() => {
    getTaxonomies();
  }, []);

  return (
    <div className={styles.Filters}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <h4>Filters</h4>
        <h5>Search</h5>
        <Input size={"md"} placeholder="Search for something" />

        <div className={styles.FilterGroup}>
          <h5>
            <img src={"/local/svg/arrowup.svg"} /> TM Dimensions{" "}
          </h5>
          <Checkbox key={-1} label={"All"} radius={3} mb={10} />
          {dimensions?.map((item, key) => {
            return (
              <Checkbox
                key={key}
                checked={form.values.dimensions.includes(item.name)}
                onChange={(event) => {
                  const currentCheckbox = form.values.dimensions;
                  if (event.currentTarget.checked) {
                    form.setFieldValue("dimensions", [
                      ...currentCheckbox,
                      item.name,
                    ]);
                  } else {
                    form.setFieldValue(
                      "dimensions",
                      currentCheckbox.filter((i) => i !== item.name)
                    );
                  }
                }}
                label={decodeHtmlEntities(item.name)}
                radius={3}
                mb={10}
              />
            );
          })}
        </div>

        <div className={styles.FilterGroup}>
          <h5>
            <img src={"/local/svg/arrowup.svg"} /> Regions{" "}
          </h5>
          <Checkbox key={-1} label={"All"} radius={3} mb={10} />
          {regions?.map((item, key) => {
            return (
              <Checkbox
                key={key}
                label={decodeHtmlEntities(item.name)}
                radius={3}
                mb={10}
              />
            );
          })}
        </div>

        <div className={styles.FilterGroup}>
          <h5>
            <img src={"/local/svg/arrowup.svg"} /> Countries{" "}
          </h5>
          <Checkbox key={-1} label={"All"} radius={3} mb={10} />
          {countries?.map((item, key) => {
            return (
              <Checkbox
                key={key}
                label={decodeHtmlEntities(item.name)}
                radius={3}
                mb={10}
              />
            );
          })}
        </div>

        <div className={styles.FilterGroup}>
          <h5>
            <img src={"/local/svg/arrowup.svg"} /> Content Type{" "}
          </h5>
        </div>

        <Button size={"md"} fullWidth>
          {" "}
          Aply Filters{" "}
        </Button>
      </form>
    </div>
  );
};

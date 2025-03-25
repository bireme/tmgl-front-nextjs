import { Button, Checkbox, Input } from "@mantine/core";
import { IconArrowUp, IconChevronCompactUp } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { PostsApi } from "@/services/posts/PostsApi";
import { TaxonomyTermDTO } from "@/services/types/taxonomies.dto";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/components/forms.module.scss";
import { useForm } from "@mantine/form";

interface FiltersFormProps {
  onSubmit: (regions?: number[]) => void;
}
export const FiltersForm = ({ onSubmit }: FiltersFormProps) => {
  const initialValues: {
    dimensions: number[];
    regions: number[];
  } = {
    dimensions: [],
    regions: [],
  };

  const form = useForm({
    initialValues: initialValues,
  });

  //TODO: fix to use region
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

        {/* <div className={styles.FilterGroup}>
          <h5>
            <img src={"/local/svg/arrowup.svg"} /> TM Dimensions{" "}
          </h5>
          <Checkbox
            key={-1}
            onChange={(event) => {
              if (event.currentTarget.checked) {
                form.setFieldValue(
                  "dimensions",
                  dimensions ? dimensions.map((d) => d.id) : []
                );
              } else {
                form.setFieldValue("dimensions", []);
              }
            }}
            label={"All"}
            radius={3}
            mb={10}
          />
          {dimensions?.map((item, key) => {
            return (
              <Checkbox
                key={key}
                checked={form.values.dimensions.includes(item.id)}
                onChange={(event) => {
                  const currentCheckbox = form.values.dimensions;
                  if (event.currentTarget.checked) {
                    form.setFieldValue("dimensions", [
                      ...currentCheckbox,
                      item.id,
                    ]);
                  } else {
                    form.setFieldValue(
                      "dimensions",
                      currentCheckbox.filter((i) => i !== item.id)
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
        </div> */}

        <Button type="submit" size={"md"} fullWidth>
          {" "}
          Apply{" "}
        </Button>
      </form>
    </div>
  );
};

export interface TrendingTopicsFiltersFormProps {
  queryString: string;
  setQueryString: (queryString: string) => void;
}
export const TrendingTopicsFiltersForm = ({
  queryString,
  setQueryString,
}: TrendingTopicsFiltersFormProps) => {
  const form = useForm({
    initialValues: {
      query: queryString,
    },
  });

  return (
    <div className={styles.Filters}>
      <form onSubmit={form.onSubmit((values) => setQueryString(values.query))}>
        <h4>Filters</h4>
        <h5>Search</h5>
        <Input
          size={"md"}
          placeholder="Search for something"
          {...form.getInputProps("query")}
        />
        <Button mt={20} type="submit" size={"md"} fullWidth>
          {" "}
          Apply{" "}
        </Button>
      </form>
    </div>
  );
};

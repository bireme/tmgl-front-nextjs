import { Badge, Flex } from "@mantine/core";

import { colors } from "@/helpers/colors";

export interface CategorieBadgeProps {
  categories?: Array<String>;
}
export const CategorieBadge = ({ categories }: CategorieBadgeProps) => {
  return (
    <Flex>
      {categories ? (
        <>
          {categories
            .filter((c) => c != "Uncategorized")
            .map((cat, index) => {
              return (
                <Badge
                  key={index}
                  color={colors[index]}
                  style={{ fontWeight: 400 }}
                  px={15}
                  py={10}
                >
                  {cat}
                </Badge>
              );
            })}
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export interface CustomTaxBadge {
  names: Array<string>;
}
export const CustomTaxBadge = ({ names }: CustomTaxBadge) => {
  return (
    <>
      <CategorieBadge categories={names} />
    </>
  );
};

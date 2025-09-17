import { Flex } from "@mantine/core";
import styles from "../../../styles/pages/home.module.scss";

interface DescriptionSectionProps {
  description: string;
  className?: string;
  px?: number;
  mb?: number;
}

export function DescriptionSection({
  description,
  className,
  px = 15,
  mb = 40,
}: DescriptionSectionProps) {
  if (!description) return null;

  return (
    <Flex px={px} mb={mb}>
      <p className={`${styles.DescriptionThin} ${className || ""}`}>
        {description}
      </p>
    </Flex>
  );
}

import { Flex } from "@mantine/core";
import { BreadCrumbs } from "@/components/breadcrumbs";
import styles from "../../../styles/pages/home.module.scss";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

interface BreadcrumbItem {
  path: string;
  name: string;
}

interface PageHeaderSectionProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  blackColor?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeaderSection({
  title,
  breadcrumbs,
  blackColor = false,
  rightContent,
  className,
}: PageHeaderSectionProps) {
  return (
    <>
      <BreadCrumbs blackColor={blackColor} path={breadcrumbs} />
      <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
        <h1 className={`${styles.TitleWithIcon} ${className || ""}`} style={{ margin: "5px" }}>
          {capitalizeFirstLetter(title)}
        </h1>
        {rightContent && <div>{rightContent}</div>}
      </Flex>
    </>
  );
}

import { Flex, Modal } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandX,
} from "@tabler/icons-react";

import { useRouter } from "next/router";

export interface ShareModalProps {
  link: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ShareModal = ({ link, open, setOpen }: ShareModalProps) => {
  const router = useRouter();
  return (
    <>
      <Modal
        opened={open}
        withCloseButton={false}
        onClose={() => {
          setOpen(false);
        }}
        centered
      >
        <Flex gap={10} justify={"space-around"}>
          <IconBrandFacebook
            stroke={1.5}
            size={33}
            onClick={() => {
              router.push(
                `https://www.facebook.com/sharer/sharer.php?u=${link}`
              );
            }}
            style={{ cursor: "pointer" }}
          />
          <IconBrandX
            stroke={1.5}
            size={33}
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`https://twitter.com/intent/tweet?text=${link}`);
            }}
          />
          <IconBrandLinkedin
            stroke={1.5}
            size={33}
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(
                `https://www.linkedin.com/shareArticle?mini=true&url=${link}`
              );
            }}
          />
        </Flex>
      </Modal>
    </>
  );
};

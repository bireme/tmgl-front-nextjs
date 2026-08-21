import { Flex, Modal } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

export interface ShareModalProps {
  link: string;
  title?: string;
  description?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ShareModal = ({
  link,
  title = "",
  description = "",
  open,
  setOpen,
}: ShareModalProps) => {
  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getCurrentUrl = () =>
    link || (typeof window !== "undefined" ? window.location.href : "");

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
              openShareWindow(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  getCurrentUrl()
                )}`
              );
            }}
            style={{ cursor: "pointer" }}
          />
          <IconBrandX
            stroke={1.5}
            size={33}
            style={{ cursor: "pointer" }}
            onClick={() => {
              openShareWindow(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  getCurrentUrl()
                )}&text=${encodeURIComponent(title || description)}`
              );
            }}
          />

          <IconBrandLinkedin
            stroke={1.5}
            size={33}
            style={{ cursor: "pointer" }}
            onClick={() => {
              openShareWindow(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  getCurrentUrl()
                )}`
              );
            }}
          />
        </Flex>
      </Modal>
    </>
  );
};

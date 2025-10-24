import { Badge, Flex, LoadingOverlay } from "@mantine/core";
import { HTMLAttributes, useEffect, useState, useRef } from "react";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";

import { IframeThumbNail } from "../multimedia/pdf_thumbnail";
import { PropsWithChildren } from "react";
import moment from "moment";
import styles from "../../../styles/components/resources.module.scss";

export interface ResourceCardProps {
  title: string;
  excerpt: string;
  link?: string;
  displayType: string;
  image?: string;
  tags?: Array<TagItem>;
  resourceType?: string;
  size?: string;
  target?: string;
  type?: string;
  fullWidth?: boolean;
  demo?: boolean;
  className?: string;
}

export interface TagItem {
  name: string;
  type: string;
}

export type DefaultCardProps = PropsWithChildren<
  {
    displayType: string;
    fullWidth?: boolean;
    size?: string;
    justify?: string;
  } & HTMLAttributes<HTMLDivElement>
>;

export const DefaultCard = ({
  displayType,

  fullWidth,
  size,
  children,
  className,
  justify,
  style,
  ...rest
}: DefaultCardProps) => {
  return (
    <Flex
      direction={displayType === "column" ? "column" : "row"}
      align={displayType === "column" ? "flex-end" : "flex-start"}
      justify={justify ? justify : displayType === "column" ? "space-between" : "flex-start"}
      gap={30}
      className={`${styles.ResourceCard} ${
        displayType === "column" ? "" : styles.Row
      } ${size === "Small" ? styles.Small : ""} ${
        fullWidth ? styles.FullWidth : ""
      } ${className ?? ""}`}
      style={{ height: "100%", ...style }}
      {...rest}
    >
      {children}
    </Flex>
  );
};

// Lazy loading component for thumbnails
const LazyThumbnail = ({ 
  image, 
  type, 
  displayType 
}: { 
  image: string; 
  type?: string; 
  displayType: string; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isVisible ? (
        <ThumbnailContent image={image} type={type} displayType={displayType} />
      ) : (
        <div 
          className={styles.CardImage}
          style={{ 
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '8px' }}>📹</div>
            <div>Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Extracted thumbnail content component
const ThumbnailContent = ({ 
  image, 
  type, 
  displayType 
}: { 
  image: string; 
  type?: string; 
  displayType: string; 
}) => {
  const [imageError, setImageError] = useState(false);

  const isPdf = (thumb: string | string[]): boolean => {
    if (type == "Pdf") return true;
    if (Array.isArray(thumb)) thumb = thumb[0];
    if (typeof thumb !== "string") return false;
    return thumb.split("?")[0].toLowerCase().endsWith(".pdf");
  };

  const isImage = (thumb: string | string[]): boolean => {
    if (Array.isArray(thumb)) thumb = thumb[0];
    if (typeof thumb !== "string") return false;

    const url = thumb.split("?")[0].toLowerCase();
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(url);
  };

  const isVideo = (thumb: string | string[]): boolean => {
    if (Array.isArray(thumb)) thumb = thumb[0];
    if (typeof thumb !== "string") return false;
    return thumb.includes("youtube") || thumb.includes("vimeo") || thumb.includes("youtu.be");
  };

  // Show fallback if image failed to load
  if (imageError || !image) {
    return (
      <div
        className={styles.CardImage}
        style={{ 
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            {type === "Video" ? "📹" : type === "Pdf" ? "📄" : "🖼️"}
          </div>
          <div>{type || "Media"}</div>
        </div>
      </div>
    );
  }

  if (isPdf(image)) {
    return <IframeThumbNail url={image} type="pdf" />;
  }
  
  if (isImage(image)) {
    return (
      <div
        className={styles.CardImage}
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onError={() => setImageError(true)}
      >
        {type === "Video" && (
          <IconPlayerPlay
            color="white"
            size={30}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "50%",
              padding: "5px"
            }}
          />
        )}
      </div>
    );
  }

  // Fallback for other types
  return (
    <div
      className={styles.CardImage}
      style={{ 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '8px' }}>
          {type === "Video" ? "📹" : type === "Pdf" ? "📄" : "🖼️"}
        </div>
        <div>{type || "Media"}</div>
      </div>
    </div>
  );
};

export const ResourceCard = ({
  title,
  excerpt,
  link,
  displayType,
  image,
  tags,
  size,
  target = "_self",
  type,
  fullWidth = false,
  demo = false,
  className,
}: ResourceCardProps) => {
  const colors = {
    country: "#69A221",
    descriptor: "#8B142A",
    region: "#3F6114",
    type: "#1A4B8C",
  };

  const applyTag = (tagType: string, tagName: string) => {
    window.location.href = `${window.location.pathname}?${tagType}=${tagName}`;
  };

  const cardImage = () => {
    if (image) {
      return <LazyThumbnail image={image} type={type} displayType={displayType} />;
    }
    return <></>;
  };

  return (
    <DefaultCard
      fullWidth={fullWidth}
      displayType={displayType}
      size={size}
      className={className}
      style={{
        opacity: demo ? 0.6 : 1,
        pointerEvents: demo ? "none" : "auto",
        cursor: demo ? "not-allowed" : "auto",
      }}
    >
      {image && displayType !== "column" ? cardImage() : <></>}
      <Flex 
        direction="column" 
        style={{ 
          flex: 1, 
          width: displayType === "column" ? "100%" : "auto",
          justifyContent: displayType === "column" ? "space-between" : "flex-start"
        }}
      >
        <div className={styles.CardContent}>
          {image && displayType === "column" ? cardImage() : <></>}
          <small>{type}</small>
          <h3>{title}</h3>
          <p>{excerpt}</p>
        </div>
        <Flex style={{ width: "100%" }} direction="column">
          <Flex mb={20} wrap="wrap" gap={5} className={styles.Tags} >
            {tags
              ?.filter((tag) => tag.type === "descriptor")
              .map((tag) => (
                <Badge
                  onClick={() => applyTag("thematicArea", tag.name)}
                  size="md"
                  key={tag.name}
                  color={colors.descriptor}
                >
                  {tag.name}
                </Badge>
              ))}
            {tags
              ?.filter((tag) => tag.type === "region")
              .map((tag) => (
                <Badge
                  onClick={() => applyTag("region", tag.name)}
                  size="md"
                  key={tag.name}
                  color={colors.region}
                >
                  {tag.name}
                </Badge>
              ))}
            {tags
              ?.filter((tag) => tag.type === "country")
              .map((tag) => (
                <Badge
                  onClick={() => applyTag("country", tag.name)}
                  size="md"
                  key={tag.name}
                  color={colors.country}
                >
                  {tag.name}
                </Badge>
              ))}
            {tags
              ?.filter((tag) => tag.type === "type")
              .map((tag) => (
                <Badge size="md" key={tag.name} color={colors.type}>
                  {tag.name}
                </Badge>
              ))}
            {tags
              ?.filter(
                (tag) =>
                  tag.type === "year" &&
                  moment(tag.name, moment.ISO_8601, true).isValid()
              )
              .map((tag) => (
                <Badge size="md" key={tag.name} color={colors.descriptor}>
                  {tag.name}
                </Badge>
              ))}
          </Flex>
          {link && !demo && (
          <Flex
            align="flex-end"
            justify="flex-end"
            style={{ height: displayType === "column" ? "auto" : "100%" }}
          >
            <a className={styles.buttonLink} href={link} target={target}>
              <IconArrowRight />
            </a>
          </Flex> 
          )}
        </Flex>
      </Flex>
    </DefaultCard>
  );
};

export const MediaCard = {};

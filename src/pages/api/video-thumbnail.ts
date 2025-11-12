import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Simple in-memory cache for video thumbnails
const thumbnailCache = new Map<string, { thumbnail: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.method === "POST" ? req.body : req.query;

  if (!url || typeof url !== "string") {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(400).json({ error: "URL inválida" });
  }

  // Check cache first
  const cached = thumbnailCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(200).json({ thumbnail: cached.thumbnail });
  }

  try {
    let thumbnailUrl = "";

    if (url.includes("vimeo")) {
      // Extract video ID from Vimeo URL
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0]?.split("/")[0];
      
      if (!videoId || !/^\d+$/.test(videoId)) {
        throw new Error("Invalid Vimeo URL");
      }

      try {
        // Try the oEmbed API first (more reliable)
        const oembedResponse = await axios.get(
          `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
          { timeout: 3000 }
        );
        
        if (oembedResponse.data?.thumbnail_url) {
          thumbnailUrl = oembedResponse.data.thumbnail_url;
        } else {
          throw new Error("No thumbnail from oEmbed");
        }
      } catch (oembedError) {
        console.warn("Vimeo oEmbed failed, trying fallback:", oembedError instanceof Error ? oembedError.message : String(oembedError));
        // Fallback: try to construct thumbnail URL from video ID
        // This is a guess based on Vimeo's pattern, may not always work
        thumbnailUrl = `https://i.vimeocdn.com/video/${videoId}_640x360.jpg`;
      }
    } else if (url.includes("youtube") || url.includes("youtu.be")) {
      try {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);
        let videoId = params.get("v") ?? "";

        if (!videoId) {
          const pathSegments = parsedUrl.pathname.split("/");
          videoId = pathSegments[pathSegments.length - 1];
        }

        if (videoId.includes("?")) videoId = videoId.split("?")[0];
        if (videoId.includes("&")) videoId = videoId.split("&")[0];

        // Validate video ID format
        if (!videoId || videoId.length < 10) {
          throw new Error("Invalid YouTube video ID");
        }

        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } catch (e) {
        console.warn("YouTube URL parsing failed:", e instanceof Error ? e.message : String(e));
        throw new Error("Invalid YouTube URL");
      }
    } else {
      // For other video platforms, return a default thumbnail
      thumbnailUrl = "/local/jpeg/multimedia.jpg";
    }

    // Cache the result
    thumbnailCache.set(url, { thumbnail: thumbnailUrl, timestamp: Date.now() });
    
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(200).json({ thumbnail: thumbnailUrl });
  } catch (error) {
    console.warn("Erro ao obter thumbnail de vídeo:", error);
    const fallbackThumbnail = "/local/jpeg/multimedia.jpg";
    
    // Cache the fallback too
    thumbnailCache.set(url, { thumbnail: fallbackThumbnail, timestamp: Date.now() });
    
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(200).json({ thumbnail: fallbackThumbnail });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { z } from "zod";

export class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

export function apiError(res: NextApiResponse, error: unknown) {
  let failure = new ApiError(500, "INTERNAL_ERROR", "We couldn't complete this action. Please try again.");
  if (error instanceof ApiError) failure = error;
  else if (error instanceof z.ZodError) failure = new ApiError(400, "INVALID_INPUT", "Please check the information and try again.");
  else if (axios.isAxiosError(error)) {
    if (["ECONNABORTED", "ETIMEDOUT"].includes(error.code || "")) {
      failure = new ApiError(504, "UPSTREAM_TIMEOUT", "This is taking longer than expected. Please try again shortly.");
    } else if (error.response?.status === 404) {
      failure = new ApiError(404, "NOT_FOUND", "We couldn't find this content. It may have been moved or removed.");
    } else {
      failure = new ApiError(502, "UPSTREAM_ERROR", "We couldn't load this content right now. Please try again later.");
    }
  }
  // Do not log Axios errors: their request configuration contains API keys.
  if (failure.statusCode >= 500) console.error(`[api] ${failure.code}`);
  res.setHeader("Cache-Control", "no-store");
  return res.status(failure.statusCode).json({
    status: false, data: {}, message: failure.message,
    error: { code: failure.code, message: failure.message },
  });
}

export function apiHandler(methods: string[], handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    try {
      if (!methods.includes(req.method || "")) {
        res.setHeader("Allow", methods.join(", "));
        throw new ApiError(405, "METHOD_NOT_ALLOWED", "We couldn't complete this action. Please refresh the page and try again.");
      }
      return await handler(req, res);
    } catch (error) {
      return apiError(res, error);
    }
  };
}

const windows = new Map<string, { count: number; expires: number }>();
/** Per-process guard; use socket addresses, never an untrusted forwarded header. */
export function rateLimit(req: NextApiRequest, res: NextApiResponse, scope: string, limit: number) {
  const now = Date.now();
  for (const [key, value] of windows) if (value.expires <= now) windows.delete(key);
  const key = `${scope}:${req.socket.remoteAddress || "unknown"}`;
  const current = windows.get(key);
  if (current && current.count >= limit) {
    res.setHeader("Retry-After", Math.ceil((current.expires - now) / 1000));
    throw new ApiError(429, "RATE_LIMITED", "Please wait a moment before trying again.");
  }
  if (!current && windows.size >= 10000) throw new ApiError(503, "BUSY", "We're busy right now. Please try again in a moment.");
  windows.set(key, { count: (current?.count || 0) + 1, expires: current?.expires || now + 60000 });
}

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new ApiError(500, "CONFIGURATION_ERROR", "This feature isn't available right now. Please try again later.");
  return value;
}

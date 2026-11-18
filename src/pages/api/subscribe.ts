import axios from "axios";
import { z } from "zod";
import { decryptFromEnv } from "@/helpers/crypto";
import { apiHandler, ApiError, rateLimit, requiredEnv } from "@/server/api";

const input = z.object({ email: z.email().max(254) });
export default apiHandler(["POST"], async (req, res) => {
  rateLimit(req, res, "subscribe", 10);
  const { email } = input.parse(req.body);
  const apiKey = decryptFromEnv(requiredEnv("MAILCHIMP_API_KEY"));
  const list = requiredEnv("MAILCHIMP_LIST_ID");
  const dataCenter = requiredEnv("MAILCHIMP_DATA_CENTER");
  if (!apiKey || !/^[a-z]{2}\d+$/.test(dataCenter)) throw new ApiError(500, "CONFIGURATION_ERROR", "Newsletter sign-up isn't available right now. Please try again later.");
  try {
    await axios.post(`https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(list)}/members`,
      { email_address: email, status: "pending" },
      { headers: { Authorization: `apikey ${apiKey}` }, timeout: 15000, maxRedirects: 0 });
    return res.status(200).json({ message: "Check your inbox to confirm your subscription.", status: true });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.title === "Member Exists") {
      throw new ApiError(409, "ALREADY_SUBSCRIBED", "You're already subscribed with this email address.");
    }
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError(400, "INVALID_EMAIL", "We couldn't sign you up. Please check your email address and try again.");
    }
    throw error;
  }
});

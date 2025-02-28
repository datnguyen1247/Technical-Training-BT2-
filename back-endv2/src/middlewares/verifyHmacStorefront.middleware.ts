import * as crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const verifyHmacStorefront = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { signature } = req.query;
    if (!signature) {
      return res
        .status(403)
        .json({ error: "Missing required query parameters" });
    }
    const APP_SECRET = process.env.API_SECRET_KEY;
    console.log("APP_SECRET", APP_SECRET);
    const params: Record<string, string> = {};
    Object.keys(req.query).forEach((key) => {
      if (key !== "signature") {
        params[key] = Array.isArray(req.query[key])
          ? req.query[key].join(",")
          : (req.query[key] as string);
      }
    });
    const orderedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    console.log("OrderedParams", orderedParams);
    const generatedSignature = crypto
      .createHmac("sha256", APP_SECRET)
      .update(orderedParams)
      .digest("hex");
    console.log("GeneratedSignature", generatedSignature);
    console.log("Signature", signature);
    const isValidHmac = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(generatedSignature, "hex")
    );

    if (!isValidHmac) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    next();
  } catch (error) {
    console.error("HMAC verification failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default verifyHmacStorefront;

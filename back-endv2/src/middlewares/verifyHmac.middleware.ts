import * as crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const verifyHMAC = (req: Request, res: Response, next: NextFunction) => {
    const queryParamsRaw = req.headers.hmac as string;
    if (!queryParamsRaw) {
        return res.status(400).send("Invalid HMAC: Missing HMAC header.");
    }

    try {
        const queryParams: Record<string, string> = JSON.parse(queryParamsRaw);
        if (!queryParams.hmac) {
            return res.status(400).send("Invalid HMAC: Missing HMAC value.");
        }

        const hmac = queryParams.hmac;
        delete queryParams.hmac; 

        const orderedParams = Object.keys(queryParams)
            .sort()
            .map((key) => `${key}=${queryParams[key]}`)
            .join("&");

        const calculatedHmac = crypto
            .createHmac("sha256", process.env.API_SECRET_KEY as string)
            .update(orderedParams)
            .digest("hex");

        const isValidHmac =
            hmac.length === calculatedHmac.length &&
            crypto.timingSafeEqual(
                Buffer.from(calculatedHmac, "utf-8"),
                Buffer.from(hmac, "utf-8")
            );

        if (!isValidHmac) {
            return res.status(400).send("Invalid HMAC: Request is not authentic.");
        }

        next();
    } catch (error) {
        return res.status(400).send("Invalid HMAC: Error parsing request.");
    }
};

export default verifyHMAC;

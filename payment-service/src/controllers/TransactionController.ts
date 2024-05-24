import { Response } from "express";
import { AuthRequest } from "../middleware";
import { ApiError, requiredFieldsFromRequestBody, createToken } from "../utils";
import config from "../config/config";

const charge = async (req: AuthRequest, res: Response) => {
    try {
        const { omiseChargeURL, omiseSecretKey } = config;
        if (!omiseChargeURL || !omiseSecretKey) {
            console.error("Omise configuration not found.");
            throw new ApiError(500, "Internal Server Error");
        }

        const { cardNumber, cardHolder, expiryDate, cvv, city, postalCode, amount } = req.body;
        const missingFields = requiredFieldsFromRequestBody(["cardNumber", "cardHolder", "expiryDate", "cvv", "amount"], req.body);
        if (missingFields.length > 0) {
            throw new ApiError(400, `${missingFields.join(", ")} are required.`);
        }

        const token = await createToken({
            cardNumber,
            cardHolder,
            expiryDate,
            cvv,
            city,
            postalCode,
        });

        const response = await fetch(omiseChargeURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(
                    `${omiseSecretKey}:`
                ).toString("base64")}`,
            },
            body: JSON.stringify({
                amount,
                currency: "THB",
                card: token,
            }),
        });

        const data = await response.json();

        if (data.object == "error") {
            throw new ApiError(400, data.message);
        }
        else if (data?.failure_message) {
            throw new ApiError(400, data.failure_message);
        }

        return res.json({
            status: 200,
            message: "Payment successful!",
            data,
        });
    } catch (error: any) {
        return res.json({
            status: error?.statusCode || 500,
            message: error.message || "Internal Server Error",
        });
    }
};

export default { charge };
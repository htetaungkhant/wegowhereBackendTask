import config from "../config/config";
import { ApiError } from "./apiError";

interface CreditCardProps {
	cardNumber: string
	cardHolder: string
	expiryDate: string
	cvv: string
	city?: string
	postalCode?: string
}

const omisePublicKey = config.omisePublicKey;
const omiseCreateTokenURL = config.omiseCreateTokenURL;

export const createToken = async (creditCard: CreditCardProps) => {
    try {
        if (!omiseCreateTokenURL || !omisePublicKey) {
            console.error("Omise configuration not found.");
            throw new ApiError(500, "Internal Server Error");
        }
        else if (!creditCard.cardNumber || !creditCard.cardHolder || !creditCard.expiryDate || !creditCard.cvv) {
            throw new ApiError(400, "Card number, card holder, expiry date, and cvv are required.");
        }

        let body = `card[name]=${creditCard.cardHolder}&card[number]=${creditCard.cardNumber}&card[security_code]=${creditCard.cvv}&card[expiration_month]=${parseInt(creditCard.expiryDate.split('/')[0])}&card[expiration_year]=20${creditCard.expiryDate.split('/')[1]}`;
        if (creditCard.city) {
            body += `&card[city]=${creditCard.city}`;
        }
        if (creditCard.postalCode) {
            body += `&card[postal_code]=${creditCard.postalCode}`;
        }

        const response = await fetch(omiseCreateTokenURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${omisePublicKey}:`
                ).toString("base64")}`,
            },
            body,
        });
    
        const data = await response.json();
    
        if(data?.id?.startsWith("tokn_")) {
            return data.id;
        }
        
        throw new ApiError(400, `Omise => ${data.message}`);
    } catch (error: any) {
        console.error("Omise API error =>", JSON.stringify(error));
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");   
    }
}
import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { 
    PORT, 
    JWT_SECRET, 
    NODE_ENV, 
    MESSAGE_BROKER_URL,
    OMISE_SECRET_KEY,
    OMISE_PUBLIC_KEY,
    OMISE_API_VERSION,
    OMISE_CREATE_TOKEN_URL,
    OMISE_CREATE_SOURCE_URL,
    OMISE_CHARGE_URL,
} = process.env;

export default {
    PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    omiseSecretKey: OMISE_SECRET_KEY,
    omisePublicKey: OMISE_PUBLIC_KEY,
    omiseApiVersion: OMISE_API_VERSION,
    omiseCreateTokenURL: OMISE_CREATE_TOKEN_URL,
    omiseCreateSourceURL: OMISE_CREATE_SOURCE_URL,
    omiseChargeURL: OMISE_CHARGE_URL,
};

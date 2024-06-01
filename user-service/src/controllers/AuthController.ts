import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config/config";
import { IUser } from "../database";

const jwtAccessTokenSecret = config.JWT_ACCESSTOKEN_SECRET as string;
const jwtRefreshTokenSecret = config.JWT_REFRESHTOKEN_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ApiError(400, "User already exists!");
        }

        const user = await User.create({
            name,
            email,
            password: await encryptPassword(password),
        });

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        return res.json({
            status: 200,
            message: "User registered successfully!",
            data: userData,
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
};

const createSendToken = async (user: IUser, res: Response) => {
    const { name, email, id } = user;
    const accessToken = jwt.sign({ name, email, id }, jwtAccessTokenSecret, {
        expiresIn: "15m",
    });
    if (config.env === "production") cookieOptions.secure = true;
    const refreshToken = jwt.sign({ id }, jwtRefreshTokenSecret, {
        expiresIn: "90d",
    });
    res.cookie("jwt", refreshToken, cookieOptions);

    return accessToken;
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (
            !user ||
            !(await isPasswordMatch(password, user.password as string))
        ) {
            throw new ApiError(400, "Incorrect email or password");
        }

        const token = await createSendToken(user!, res);

        return res.json({
            status: 200,
            message: "User logged in successfully!",
            data: {
                id: user!._id,
                name: user!.name,
                email: user!.email,
                token,
            },
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
};

const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            throw new ApiError(401, "You are not logged in");
        }

        if (!jwtRefreshTokenSecret) {
            throw new ApiError(500, "Refresh token secret is not defined");
        }

        try {
            const decoded = jwt.verify(token, jwtRefreshTokenSecret) as { id: string };
            const user = await User.findById(decoded?.id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }

            const newToken = await createSendToken(user!, res);

            return res.json({
                status: 200,
                message: "Token refreshed successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    token: newToken,
                },
            });
        }
        catch (error: any) {
            throw new ApiError(401, "Invalid token. Please log in again");
        }
    }
    catch (error: any) {
        return res.json({
            status: error?.statusCode || 500,
            message: error?.message || "Internal Server Error",
        });
    }
};

export default {
    register,
    login,
    refreshToken,
};

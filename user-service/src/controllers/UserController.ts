import { Request, Response } from "express";
import { User } from "../database";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();

        const usersWithoutPassword = users.map((user) => {
            const { password, _id, ...rest } = user.toObject();
            return { id: _id, ...rest };
        });

        return res.json({
            status: 200,
            message: "Users retrieved successfully!",
            data: usersWithoutPassword,
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
};

export default {
    getAllUsers,
};
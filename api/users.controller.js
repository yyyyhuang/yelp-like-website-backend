import UsersDAO from "../dao/usersDAO.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");


export default class UsersController {
    static async apiCreateUser(req, res, next) {
        try {
            const user_id = randomUUID();
            const userName = req.body.name;
            const email = req.body.email;
            const password = bcrypt.hashSync(req.body.password, 10);

            const emailExist = await UsersDAO.checkDuplicate(email);
            if (emailExist) {
                return res.status(400).json({ error: "Email already exist" });
            }
            const userResponse = await UsersDAO.addUser(user_id, userName, email, password);

            var { error } = userResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to create user. "});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateUser(req, res, next) {
        try {
            const userId = req.body.user_id;
            const name = req.body.name;

            const updateResponse = await UsersDAO.updateUser(userId, name);

            var { error } = updateResponse;
            console.log(error);
            if (error || updateResponse.modifiedCount < 1) {
                res.status(500).json({ error: "Unable to update user. "});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteUser(req, res, next) {
        try {
            const userId = req.body._id;

            const deleteResponse = await UsersDAO.deleteUser(userId);

            var { error } = deleteResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to delete user. "});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    
    static async apiGetUserById(req, res, next) {
        try {
            let id = req.body.user_id;
            let user = await UsersDAO.getUserById(id);
            if (!user) {
                // res.status(404).json({ error: "not found" });
                return;
            }
            res.json(user);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(404).json({ error: "Email and password are required." });
            }
            const foundUser = UsersDAO.checkDuplicate(email);
            if (!foundUser) {
                return res.status(401) // unauthorized
            }
            // evaluate password
            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                // create JWTs
                const accessToken = jwt.sign(
                    { "user_id": foundUser.user_id },
                    { expiresIn: '1m' }
                );
                const refreshToken = jwt.sign(
                    { "user_id": foundUser.user_id },
                    { expiresIn: '1d' }
                );

                // To do: save refreshToken with currentUser
                // const otherUsers
                // const currentUser = { ...foundUser, refreshToken };
                res.json({
                    accessToken,
                    refreshToken,
                });
            } else {
                return res.status(400).json({ error: "Email or password is wrong." });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}


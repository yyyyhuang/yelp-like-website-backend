import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {
    static async apiCreateUser(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const userName = req.body.name
            const password = req.body.password;

            const userResponse = await UsersDAO.addUser(user_id, userName, password);

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
}


import mongodb from "mongodb";
import bcrypt from "bcrypt";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.RESTAURANTREVIEWS_NS).collection('users');
        }
        catch (e) {
            console.error(`Unable to connect in UsersDAO: ${e}`);
        }
    }

    static async addUser(user_id, name, email, password) {
        try {
            const userDoc = {
                user_id: user_id,
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 10)
            }
            return await users.insertOne(userDoc);
        }
        catch (e) {
            console.error(`Unable to create user: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(user_id, name) {
        try {
            const updateResponse = await users.updateOne(
                { user_id: user_id },
                { $set: { name: name }},
                { upsert: true }
            )
            return updateResponse
        }
        catch(e) {
            console.error(`Unable to update user: ${e}`);
            return { error: e };
        }
    }

    static async deleteUser(userId) {
        try {
            return await users.deleteOne(
                { _id: ObjectId(userId) }
            );
        }
        catch (e) {
            console.error(`Unable to delete user: ${e}`);
            return { error: e };
        }
    }

    static async getUserById(id) {
        let cursor;
        try {
            cursor = await users.find(
                { user_id: id }
            );
            const user = await cursor.toArray();
            return user[0];
        } catch(e) {
            console.error(`Something went wrong in getUserById: ${e}`);
            throw e;
        }
    }

    static async checkDuplicate(email) {
        let cursor;
        try {
            cursor = await users.find(
                { email: email }
            );
            const existingUser = await cursor.toArray();
            return existingUser[0];
        } catch(e) {
            console.error(`Something went wrong in getUserById: ${e}`);
            throw e;
        }
    }
}
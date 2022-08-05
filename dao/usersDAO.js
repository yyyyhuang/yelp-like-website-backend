import mongodb from "mongodb";
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

    static async addUser(name, date) {
        try {
            const userDoc = {
                name: name,
                yelping_since: date
            }
            return await users.insertOne(userDoc);
        }
        catch (e) {
            console.error(`Unable to create user: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(userId, name) {
        try {
            const updateResponse = await users.updateOne(
                { _id: ObjectId(userId) },
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
                { _id: id }
            );
            const user = await cursor.toArray();
            return user[0];
        } catch(e) {
            console.error(`Something went wrong in getUserById: ${e}`);
            throw e;
        }
    }
}
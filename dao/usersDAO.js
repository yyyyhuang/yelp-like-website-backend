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

    static async addUser(user_id, name) {
        try {
            const userDoc = {
                user_id: user_id,
                name: name
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
        // let cursor;
        try {
            return await users.aggregate([
                {
                    $match: {
                        user_id: id,
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'reviews',
                    }
                },
            ]).next();
        } catch(e) {
            console.error(`Something went wrong in getUserById: ${e}`);
            throw e;
        }
    }

    // static async getReviewsById(id) {
    //     try {
    //         return await users.aggregate([
    //             {
    //                 $match: {
    //                     user_id: id,
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'reviews',
    //                     localField: 'user_id',
    //                     foreignField: 'user_id',
    //                     as: 'reviews',
    //                 }
    //             },
    //         ]).next();
    //     } catch(e) {
    //         console.error(`Somthing went wrong in getRestaurantById: ${e}`);
    //         throw e;
    //     }
    // }
}
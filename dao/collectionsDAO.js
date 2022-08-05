import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let collections;

export default class CollectionsDAO {
    static async injectDB(conn) {
        if (collections) {
            return;
        }
        try {
            collections = await conn.db(process.env.RESTAURANTREVIEWS_NS).collection('collections');
        }
        catch(e) {
            console.error(`Unable to connect in CollectionsDAO: ${e}`);
        }
    }

    static async addCollection(user, collectionName) {
        try {
            const collectionDoc = {
                name: collectionName,
                user_id: user._id,
                favorites: []
            }
            return await collections.insertOne(collectionDoc);
        }
        catch (e) {
            console.error(`Unable to create collection: ${e}`);
            return { error: e };
        }
    }

    static async updateCollection(collectionId, userId, name, favorites) {
        try {
            const updateResponse = await collections.updateOne(
                { _id: ObjectId(collectionId), user_id: userId },
                { $set: { name: name, favorites: favorites }},
                { upsert: true }
            )
            return updateResponse
        }
        catch(e) {
            console.error(`Unable to update collection: ${e}`);
            return { error: e };
        }
    }

    static async deleteCollection(collectionId, userId) {
        try {
            return await collections.deleteOne(
                {
                    _id: ObjectId(collectionId),
                    user_id: userId
                }
            );
        }
        catch (e) {
            console.error(`Unable to delete collection: ${e}`);
            return { error: e };
        }
    }

    static async getCollectionsByUserId(id) {
        try {
            return await collections.aggregate([
                {
                    $match: {
                        user_id: id,
                    }
                },
                {
                    $lookup: {
                        from: 'collections',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'collections',
                    }
                }
            ]).next();
        } catch(e) {
            console.error(`Something went wrong in getCollectionsByUserId: ${e}`);
            throw e;
        }
    }

    static async getFavoritesByCollectionId(id) {
        let cursor;
        try {
            cursor = await collections.find(
                { _id: ObjectId(id) }
            );
            const favorites = await cursor.toArray();
            return favorites[0];
        } catch(e) {
            console.error(`Something went wrong in getFavoritesByCollectionId: ${e}`);
            throw e;
        }
    }
}
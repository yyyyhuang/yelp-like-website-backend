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

    static async addCollection(user_id, collectionName) {
        try {
            const collectionDoc = {
                user_id: user_id,
                name: collectionName,
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
        let cursor;
        try {
            cursor = await collections.find(
                { user_id: id }
            );
            const myCollections = await cursor.toArray();
            return myCollections;
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
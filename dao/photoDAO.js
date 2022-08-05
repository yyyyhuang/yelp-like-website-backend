/*
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let photos;

export default class PhotosDAO {

    static async injectDB(conn) {
        if (photos) {
            return;
        }
        try {
            reviews = await conn.db(process.env.RESTAURANTREVIEWS_NS).collection('photos');
        } catch(e) {
            console.error(`Unable to establish connection handle in PhotosDAO: ${e}`);
        }
    }


    static async getPhoto(businessId) {
        let cursor;
        try {
            cursor = await photos.find(
                { business_id: businessId }
            );
            const photos = await cursor.toArray();
            const photo_id = photo[0].photo_id;
            return photo_id; 
        } catch(e) {
            console.error(`Something went wrong in getPhoto: ${e}`);
            throw e;
        }
    }

}
*/
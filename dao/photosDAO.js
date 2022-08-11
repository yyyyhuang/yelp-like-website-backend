
let photos;

export default class PhotosDAO {

    static async injectDB(conn) {
        if (photos) {
            return;
        }
        try {
            photos = await conn.db(process.env.RESTAURANTREVIEWS_NS).collection('photos');
        } catch(e) {
            console.error(`Unable to establish connection handle in PhotosDAO: ${e}`);
        }
    }


    static async getPhotoById(id) {
        let photo;
        try {
            photo = await photos.findOne(
                { business_id: id }
            );
            return photo; 
        } catch(e) {
            console.error(`Something went wrong in getPhoto: ${e}`);
            return 
        }
    }

}
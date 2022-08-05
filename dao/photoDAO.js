import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let photo;

export default class PhotoDAO {

    static async injectDB(conn) {
        if (photo) {
            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('photo');
        } catch(e) {
            console.error(`Unable to establish connection handle in photoDAO: ${e}`);
        }
    }


    static async getPhoto(businessId) {
        try {
            return await restaurants.aggregate([
                {
                    $match: {
                        _id: new ObjectId(businessId),
                    }
                },
                {
                    $lookup: {
                        from: 'photo',
                        localField: 'business_id',
                        foreignField: 'business_id',
                        as: 'photo',
                    }
                }
            ]).next();
        } catch(e) {
            console.error(`Somthing went wrong in getMovieById: ${e}`);
            throw e;
        }
    }

}
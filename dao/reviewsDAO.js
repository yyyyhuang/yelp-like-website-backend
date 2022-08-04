import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.RESTAURANTREVIEWS_NS).collection('reviews');
        } catch(e) {
            console.error(`Unable to establish connection handle in reviewsDAO: ${e}`);
        }
    }

    static async addReview(restaurantId, user, text, date, stars) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: text,
                business_id: ObjectId(restaurantId),
                stars: stars
            }
            return await reviews.insertOne(reviewDoc);
             
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e};
        }
    }

    static async updateReview(reviewId, userId, text, date, stars) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, review_id: ObjectId(reviewId) },
                { $set: { text: text, date: date, stars: stars } },
              )
        
            return updateResponse;

        } catch(e) {
            console.log(`Unable to update review: ${e}`)
            return { error: e};
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                review_id: ObjectId(reviewId),
                user_id: userId
            });
            return deleteResponse;
        } catch(e) {
            console.log(`Unable to delete review: ${e}`)
            return { error: e};
        }
    }
}
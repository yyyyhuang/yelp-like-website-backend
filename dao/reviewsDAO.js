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
    /* confirm business_id format */
    static async addReview(restaurantId, user, review, date, stars) {
        try {
            const reviewDoc = {
                user_id: user._id,
                date: date,
                text: review,
                business_id: restaurantId,
                stars: stars,
                user_name: user.name
            }
            return await reviews.insertOne(reviewDoc);
             
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e};
        }
    }

    static async updateReview(reviewId, userId, review, date, stars) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, review_id: reviewId},
                { $set: { text: review, date: date, stars: stars } },
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
                review_id: reviewId,
                user_id: userId
            });
            return deleteResponse;
        } catch(e) {
            console.log(`Unable to delete review: ${e}`)
            return { error: e};
        }
    }
}
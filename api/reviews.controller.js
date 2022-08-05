import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.business_id;
            const text = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const stars = req.body.stars;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                text,
                date,
                stars
            );

            var { error } = reviewResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to post review."});
            } else {
                res.json({ status: "success"});
            }
        } catch(e) {
            res.status(500).json({ error: e.message});
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const text = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date();
            const stars = req.body.stars;

            const updateResponse = await ReviewsDAO.updateReview(
                reviewId,
                userInfo._id,
                text,
                date,
                stars
            );

            var { error } = updateResponse;
            console.log(error);
            if (error || updateResponse.modifiedCount < 1) {
                res.status(500).json({ error: "Unable to update review."});
            } else {
                res.json({ status: "success"});
            }
        } catch(e) {
            res.status(500).json({ error: e.message});
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
           
            const reviewId = req.body.review_id;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            
            const deleteResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userInfo._id
            );

            var { error } = deleteResponse;
            if (error) {
                res.status(500).json({ error: "Unable to delete review."});
            } else {
                res.json({ status: "success"});
            }
        } catch(e) {
            res.status(500).json({ error: e.message});
        }
    }
}

import express from 'express'; // using express's router functionality
import MovieController from './movies.controller.js';
import ReviewsControllers from './reviews.controller.js';
import FavoritesController from './favorites.controller.js';

// "routing" refers to handling requests
const router = express.Router(); // get access to express router

router.route("/").get(MovieController.apiGetMovies); // a GET request to the / 
router.route("/id/:id").get(MovieController.apiGetMovieById);
router.route("/ratings").get(MovieController.apiGetRatings);

router.route("/review").post(ReviewsControllers.apiPostReview);
router.route("/review").put(ReviewsControllers.apiUpdateReview);
router.route("/review").delete(ReviewsControllers.apiDeleteReview);

router
    .route("/favorites")
    .put(FavoritesController.apiUpdateFavorites);
router
    .route("/favorites/:userId")
    .get(FavoritesController.apiGetFavorites);

    /*
router
    .route("/favoritesList")
    .get(FavoritesController.apiRetrieveFavorites); */
export default router; // to be used by other server.js
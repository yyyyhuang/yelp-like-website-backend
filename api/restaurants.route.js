import express from 'express'; // using express's router functionality
import RestaurantsController from './restaurants.controller.js';
import ReviewsController from './reviews.controller.js';
import UsersController from './users.controller.js';
import CollectionsController from './collections.controller.js';

// "routing" refers to handling requests
const router = express.Router(); // get access to express router

router.route("/").get(RestaurantsController.apiGetRestaurants); // a GET request to the / 
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById);
router.route("/ratings").get(RestaurantsController.apiGetRatings);
router.route("/distance").get(RestaurantsController.apiGetByDistance);

router.route("/review").post(ReviewsController.apiPostReview);
router.route("/review").put(ReviewsController.apiUpdateReview);
router.route("/review").delete(ReviewsController.apiDeleteReview);

router.route("/user").get(UsersController.apiGetUserById);


router.route("/user").post(UsersController.apiCreateUser);
router.route("/user").put(UsersController.apiUpdateUser);
router.route("/user").delete(UsersController.apiDeleteUser);


router.route("/collections").post(CollectionsController.apiCreateCollection);
router.route("/collections").put(CollectionsController.apiUpdateCollection);
router.route("/collections").delete(CollectionsController.apiDeleteCollection);
router.route("/collections/:user_id").get(CollectionsController.apiGetCollectionsByUserId);
router.route("/collections/id/:id").get(CollectionsController.apiGetFavoritesByCollectionId);


export default router; // to be used by other server.js
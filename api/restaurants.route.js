import express from 'express'; // using express's router functionality
import RestaurantsController from './restaurants.controller.js';
import ReviewsController from './reviews.controller.js';
import UsersController from './users.controller.js';

// "routing" refers to handling requests
const router = express.Router(); // get access to express router

router.route("/").get(RestaurantsController.apiGetRestaurants); // a GET request to the / 
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById);
router.route("/stars").get(RestaurantsController.apiGetStars);

router.route("/review").post(ReviewsController.apiPostReview);
router.route("/review").put(ReviewsController.apiUpdateReview);
router.route("/review").delete(ReviewsController.apiDeleteReview);

router.route("/user").get(UsersController.apiGetUsers);


router.route("/user").post(UsersController.apiCreateUser);
router.route("/user").put(UsersController.apiUpdateUser);
router.route("/user").delete(UsersController.apiDeleteUser);

router.route("/user/:id").get(UsersController.apiGetUserById);
router.route("/user/:id/collections").get(UsersController.apiGetCollectionsByUserId);
router.route("/user/:id/collections").put(UsersController.apiUpdateCollectionsByUserId);

export default router; // to be used by other server.js
import RestaurantsDAO from "../dao/restaurantsDAO.js";
// get data needed from request -> pass to dao -> return the response from dao to front end
export default class RestaurantsController {

    static async apiGetRestaurants(req, res, next) { // next - refers to a callback function that can be called when this methods execution completes
        const restaurantsPerPage = req.query.restaurantsPerPage ?
            parseInt(req.query.restaurantsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        // const x = parseFloat(req.query.x);
        // const y = parseFloat(req.query.y);
        let filters = {} 
        if (req.query.name) { // attributes of the req.query object
            filters.name = req.query.name;
        } 
        else if (req.query.categories) {
            filters.categories = req.query.categories;
        }
        // make the request to the RestaurantsDAO object using its getRestaurant method
        // return a single page's worth of restaurants in a list along with a total number of restaurants found
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({ filters, page, restaurantsPerPage});
        // take the information retrieved by the DAO
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        };
        res.json(response); // put that into the HTTP response object as JSON
        // will be sent back to the client who queried the API
    }

    static async apiGetByDistance(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ?
            parseInt(req.query.restaurantsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const x = parseFloat(req.query.x);
        const y = parseFloat(req.query.y);
        const distance = parseInt(req.query.distance);
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getByDistance({ page, restaurantsPerPage, x, y, distance});
        let response = {
            restaurants: restaurantsList,
            page: page,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        };
        res.json(response);

    }


    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {};
            let restaurant = await RestaurantsDAO.getRestaurantById(id);
            if (!restaurant) {
                res.status(404).json({ error : "not found"});
                return;
            }
            res.json(restaurant);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e});
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await RestaurantsDAO.getRatings();
            res.json(propertyTypes);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }
}
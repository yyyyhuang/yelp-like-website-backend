import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let restaurants;

export default class RestaurantsDAO {
    static async injectDB(conn) { // conn - database connection
        if (restaurants) {
            return;
        }
        try {
            restaurants = await conn.db(process.env.MOVIEREVIEWS_NS) // get movies
                            .collection('businesses');
        } catch(e) {
            console.log(`Unable tp connect in RestaurantsDAO: ${e}`);
        }
    }

    static async getRestaurants({
        filters = null, // default params in case arg is under-specified
        page = 0,
        restaurantsPerPage = 20,
    } = {}) { // empty pbject is default parameter in case arg is undefined
        
        // construct query  whether "title" and "rated" filter values exist
        let query;
        if (filters) {
            if ("name" in filters) { // title and rated are filter values
                query = { $text: { $search: filters['name']}};
            } else if ("review_count" in filters) {
                query = { "review_count": { $eq: filters['review_count']}}
            }
        }

        // make actual query using MongoDB cursor object
        let cursor;
        try { //  await keyword enables asynchronous requests to be made in strict sequence without holding up other JS event loop processes
            cursor = await restaurants.find(query)
                                 .limit(restaurantsPerPage)
                                 .skip(restaurantsPerPage * page);
            const restaurantsList = await cursor.toArray(); // convert query to array
            const totalNumRestaurants = await businesses.countDocuments(query);
            return {restaurantsList, totalNumRestaurants};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return {restaurantsList: [], totalNumRestaurants: 0};
        }
    }

    //******************** */
    static async getRatings() {
        let ratings = [];
        try {
            ratings = await restaurantsList.distinct("review_count"); // get a list of posible values for the "rating" attribute
            return ratings;
        } catch(e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getRestaurantById(id) {
        try {
            return await restaurants.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: 'business_id',
                        foreignField: 'business_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        } catch(e) {
            console.error(`Somthing went wrong in getMovieById: ${e}`);
            throw e;
        }
    }
}
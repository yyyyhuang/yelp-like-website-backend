import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let restaurants;

export default class RestaurantsDAO {
    static async injectDB(conn) { // conn - database connection
        if (restaurants) {
            return;
        }
        try {
            restaurants = await conn.db(process.env.RESTAURANTREVIEWS_NS) // get restaurants
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
        
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters['name']}};
            } 
            // else if ("stars" in filters) {
            //     query = { "stars": { $eq: filters['stars']}}
            // }
        }

        // make actual query using MongoDB cursor object
        let cursor;
        try { //  await keyword enables asynchronous requests to be made in strict sequence without holding up other JS event loop processes
            cursor = await restaurants.find(query)
                                 .limit(restaurantsPerPage)
                                 .skip(restaurantsPerPage * page);
            const restaurantsList = await cursor.toArray(); // convert query to array
            const totalNumRestaurants = await restaurants.countDocuments(query);
            return {restaurantsList, totalNumRestaurants};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return {restaurantsList: [], totalNumRestaurants: 0};
        }
    }


    static async getRestaurantById(id) {
        try {
            return await restaurants.aggregate([
                {
                    $match: {
                        business_id: id,
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
            console.error(`Somthing went wrong in getRestaurantById: ${e}`);
            throw e;
        }
    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await restaurantsList.distinct("stars"); // get a list of posible values for the "stars" attribute
            return ratings;
        } catch(e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }
}
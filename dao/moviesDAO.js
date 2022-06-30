import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let movies;

export default class MoviesDAO {
    static async injectDB(conn) { // conn - database connection
        if (movies) {
            return;
        }
        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS) // get movies
                            .collection('movies');
        } catch(e) {
            console.log(`Unable tp connect in MoviesDAO: ${e}`);
        }
    }

    static async getMovies({
        filters = null, // default params in case arg is under-specified
        page = 0,
        moviesPerPage = 20,
    } = {}) { // empty pbject is default parameter in case arg is undefined
        
        // construct query  whether "title" and "rated" filter values exist
        let query;
        if (filters) {
            if ("title" in filters) { // title and rated are filter values
                query = { $text: { $search: filters['title']}};
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated']}}
            }
        }

        // make actual query using MongoDB cursor object
        let cursor;
        try { //  await keyword enables asynchronous requests to be made in strict sequence without holding up other JS event loop processes
            cursor = await movies.find(query)
                                 .limit(moviesPerPage)
                                 .skip(moviesPerPage * page);
            const moviesList = await cursor.toArray(); // convert query to array
            const totalNumMovies = await movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }

    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await movies.distinct("rated"); // get a list of posible values for the "rating" attribute
            return ratings;
        } catch(e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getMovieById(id) {
        try {
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
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
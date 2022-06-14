import MoviesDAO from "../dao/moviesDAO.js";

export default class MoviesController {

    static async apiGetMovies(req, res, next) { // next - refers to a callback function that can be called when this methods execution completes
        const moviesPerPage = req.query.moviesPerPage ?
            parseInt(req.query.moviesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {} 
        if (req.query.rated) { // attributes of the req.query object
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }
        // make the request to the MoviesDAO object using its getMovies method
        // return a single page's worth of movies in a list along with a total number of movies found
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({ filters, page, moviesPerPage });
        // take the information retrieved by the DAO
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        };
        res.json(response); // put that into the HTTP response object as JSON
        // will be sent back to the client who queried the API
    }

    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};
            let movie = await MoviesDAO.getMovieById(id);
            if (!movie) {
                res.status(404).json({ error : "not found"});
                return;
            }
            res.json(movie);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e});
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await MoviesDAO.getRatings();
            res.json(propertyTypes);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }
}
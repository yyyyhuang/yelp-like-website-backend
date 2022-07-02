import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';
import FavoritesDAO from './dao/favoritesDAO.js';
// connect to db and pass db to dao
async function main() { // async in order to use await later
    dotenv.config(); // set up environment variables with reference to the .env
    // mongodb objext
    const client = new mongodb.MongoClient( 
        process.env.MOVIEREVIEWS_DB_URI
    )
    const port = process.env.PORT || 8000;

    try {
        // Connection to MongoDB server
        await client.connect();
        await MoviesDAO.injectDB(client); // pass the client objet to the DAO
        await ReviewsDAO.injectDB(client);
        await FavoritesDAO.injectDB(client);

        app.listen(port, () => { //set server to listen at the port listen method is implemented in Express
            console.log('Server is running on port: '+port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);
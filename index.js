import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from './dao/restaurantsDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';
import CollectionsDAO from './dao/collectionsDAO.js';
import UsersDAO from './dao/usersDAO.js';
// import PhotoDAO from './dao/photoDAO.js';

// connect to db and pass db to dao
async function main() { // async in order to use await later
    dotenv.config(); // set up environment variables with reference to the .env
    // mongodb objext
    const client = new mongodb.MongoClient( 
        process.env.RESTAURANTREVIEWS_DB_URI
    )
    const port = process.env.PORT || 8000;

    try {
        // Connection to MongoDB server
        await client.connect();
        await RestaurantsDAO.injectDB(client); // pass the client objet to the DAO
        await ReviewsDAO.injectDB(client);
        await CollectionsDAO.injectDB(client);
        await UsersDAO.injectDB(client);
        // await PhotoDAO.injectDB(client);
        

        app.listen(port, () => { //set server to listen at the port listen method is implemented in Express
            console.log('Server is running on port: ' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);
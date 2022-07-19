// const mongoose = require('mongoose');
let favoritesCollection;

export default class FavoritesDAO {
    static async injectDB(conn) {
        if (favoritesCollection) {
            return;
        }
        try {
            favoritesCollection = await conn.db(process.env.MOVIEREVIEWS_NS).collection('favorites');
        } catch(e) {
            console.error(`Unable to connect in FavoritesDAO: ${e}`);
        }
    }

    static async updateFavorites(userId, favorites) {
        try {
            const updateResponse = await favoritesCollection.updateOne(
                { _id: userId },
                { $set: { favorites: favorites }},
                { upsert: true }
            )
            return updateResponse
            
        }
        catch(e) {
            console.error(`Unable to update favorites: ${e}`);
            return { error: e };
        }
    }

    static async getFavorites(id) {
        let cursor;
        try {
            cursor = await favoritesCollection.find({
                _id: id
            });
            const favorites = await cursor.toArray();
            return favorites[0];
        } catch(e) {
            console.error(`Something went wrong in getFavorites: ${e}`);
            throw e;
        }
    }
    /*
    static async getAll(id) {
        mongoose.connect((process.env.MOVIEREVIEWS_NS).collection('favorites'),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        const movieSchema = new mongoose.Schema({
            title: String,
            poster: String
        })

        const favoritesSchema = new mongoose.Schema({
            favorites: [{ type: Schema.Types.ObjectId,  ref: "Movie" }]
        });

        // const Movie = mongoose.model('Movie', movieSchema);
        const favorites = mongoose.model('Favorites', favoritesSchema);

        const response = await favorites.findOne({_id: id})
            .populate('favorites')
            .then(p=>console.log(p))
            .catch(error=>console.log(error));
        
        return response.favorites;
    }
    */
}
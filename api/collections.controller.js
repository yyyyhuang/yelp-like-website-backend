import CollectionsDAO from "../dao/collectionsDAO.js";

export default class CollectionsController {
    static async apiCreateCollection(req, res, next) {
        try {
            
            const user_id = req.body.user_id;
            const name = req.body.name;

            const collectionResponse = await CollectionsDAO.addCollection(user_id, name);

            var { error } = collectionResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to create collection."});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateCollection(req, res, next) {
        try {
            const collectionId = req.body._id;
            const userId = req.body.user_id;
            const name = req.body.name;
            const favorites = req.body.favorites;

            const updateResponse = await CollectionsDAO.updateCollection(
                collectionId,
                userId,
                name,
                favorites
            );

            var { error } = updateResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to update collection."});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteCollection(req, res, next) {
        try {
            const collectionId = req.body._id;
            const userId = req.body.user_id;

            const deleteResponse = await CollectionsDAO.deleteCollection(
                collectionId,
                userId
            );

            var { error } = deleteResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to delete collection."});
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetCollectionsByUserId(req, res, next) {
        try {
            let id = req.params.user_id;
            let collections = await CollectionsDAO.getCollectionsByUserId(id);
            if (!collections) {
                // res.status(404).json({ error: "not found" });
                return;
            }
            res.json(collections);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
     
    static async apiGetFavoritesByCollectionId(req, res, next) {
        try {
            let id = req.params.id;
            let favorites = await CollectionsDAO.getFavoritesByCollectionId(id);
            if (!favorites) {
                // res.status(404).json({ error: "not found" });
                return;
            }
            res.json(favorites);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
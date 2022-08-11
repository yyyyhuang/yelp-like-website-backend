import PhotosDAO from "../dao/photosDAO.js";

export default class PhotosController {

    static async apiGetPhotoById(req, res, next) {
        try {
            let id = req.params.id || {};
            let photo = await PhotosDAO.getPhotoById(id);
            if (!photo) {
                // res.status(404).json({ error : "not found"});
                return;
            }
            res.json(photo);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e});
        }
    }

}

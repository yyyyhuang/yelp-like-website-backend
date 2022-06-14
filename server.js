import express from 'express'; // Express application
import cors from 'cors'; // Cross-Origin Resource Sharing (CORS)
import movies from './api/movies.route.js';

const app = express();
// adds various functionality
app.use(cors()); //  work with JSON in Express
app.use(express.json());
// sets up the base URL for our API
app.use("/api/v1/movies", movies); // All requests coming in on URLs with this prefix will be sent to the movies.route.js
app.use('*', (req, res) => {
    res.status(404).json({error: "not found"});
})

export default app;
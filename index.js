import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import authRoutes from './routes/auth';
import setupVoteRoutes from './routes/setupVoteRoutes';
import voteRoutes from './routes/vote';


app.use(bodyParser.urlencoded({
    extended: false
}));

// application/json parsing json incoming request

app.use(bodyParser.json());

//Allowing cros requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Application routes

app.use('/api/v1', authRoutes);
app.use('/api/v1', setupVoteRoutes);
app.use('/api/v1', voteRoutes);

//Application Routes ends

//Handling errors 

app.use((error, req, res, next) => {
    //console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message
    });
});


const port = 3300;
const MONGO_URI = 'mongodb://localhost:27017/vote_api';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(connection => {
app.listen(port, () => {
    console.log('Server running at ' + port);
});
}).catch(err => {
    throw err; 
});
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/posts');
const authRouter = require('./routes/auth');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/blogmakerProd', {useNewUrlParser: true, useUnifiedTopology: true })
.then(
    () => console.log('Connected to database')
);

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Access-Control-Allow-Methods, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/blogs', router);

module.exports = app;
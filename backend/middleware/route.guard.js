const jwt = require('jsonwebtoken');
const fs = require('fs');
const { decode } = require('punycode');
const privateKey = fs.readFileSync('./backend/apiKey.txt');

module.exports = (req, res, next) => {
    try{
        let decodedDetail = jwt.verify(req.headers.authorization, privateKey);
        req.userId = decodedDetail._id;
        next();
    }
    catch(err) {
        res.status(401).json({
                message: 'Please login to continue'
            });
    }
};
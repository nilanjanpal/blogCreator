const fs = require('fs');
const jwt = require('jsonwebtoken');
const Users = require('./../models/user');
const bcrypt = require('./../../node_modules/bcrypt');
const rounds = 10;
const privateKey = fs.readFileSync('./backend/apiKey.txt');

exports.login = (req, res, next) => {
    Users.find({username: req.body.username}).then(
        (data) => {
            if(data && data.length > 0) {
                if(data[0].username == req.body.username) {
                    bcrypt.compare(req.body.password, data[0].password, 
                        (err,result) => {
                            if(result == true) {
                                const token = jwt.sign({'username': req.body.username, _id: data[0]._id}, 
                                    privateKey, 
                                    {algorithm: 'HS256',
                                     expiresIn: '1h'});
                                res.status(200).json(
                                    {
                                        token: token,
                                        expiresIn: 3600,
                                        userId: data[0]._id,
                                        message: 'Authentication Successful'
                                    }
                                );
                            }
                            else {
                                res.status(401).json(
                                    {
                                        message: 'Username or Password Incorrect'
                                    }
                                );                                
                            }
                        });
                }
                else {
                    res.status(401).json(
                        {
                            message: 'Username or Password Incorrect'
                        }
                    );
                }
            }
            else {
                res.status(401).json(
                    {
                        message: 'Username or Password Incorrect'
                    }
                );
            }
        }
    );
};

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, rounds, 
        (err, hash) => {
            const users = new Users({
                username: req.body.username,
                password: hash
            });
            Users.find({username: req.body.username}).then(
                (data) => {
                    if(data && data.length > 0 && data[0].username == req.body.username) {
                        res.status(401).json(
                            {
                                message: 'User already exists'
                            }
                        );
                    }
                    else {
                        users.save().then(
                            (data) => {
                                res.status(200).json(
                                    {
                                        message: 'User created successfully',
                                        user: data
                                    }
                                );
                            }
                        );
                    }
                }
            );
        });
};
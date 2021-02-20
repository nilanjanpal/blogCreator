const express = require('express');
const authController = require('./../controller/auth');
const authRouter = express.Router();


authRouter.post('/login',
    authController.login
);

authRouter.post('/signup',
    authController.signup
);

module.exports = authRouter;
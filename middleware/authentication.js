require('dotenv')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const authenticationMiddleWare = async (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token');
    }
    
    const token = authHeader.split(' ')[1]
    
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        const user = User.findById(payload.userId).select('-password')
        req.user = user
        req.user = {userId: payload.userId}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Unauthorized request');
    }
}

module.exports = authenticationMiddleWare
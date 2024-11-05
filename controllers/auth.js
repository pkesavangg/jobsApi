const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const {name, email, password} = req.body
    if (!(name?.trim() && email?.trim() && password)) {
       // throw new BadRequestError('Provide valid values')
    }
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token: user.getJWTToken()})

}
const login = async (req, res) => {
    const {email, password} = req.body
    if (!(email.trim() && password)) {
        throw new BadRequestError('Provide valid values')
    }
    const user = await User.findOne({email})
    
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    
    if (!await user.comparePassword(password)) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    res.status(StatusCodes.OK).json({user: {name: user.name}, token: user.getJWTToken()})
}


module.exports = {
    register, 
    login
}
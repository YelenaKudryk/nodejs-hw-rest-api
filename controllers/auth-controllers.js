const { User } = require("../models/user")
const { HttpError } = require("../helpers")
const { controllersWrapper } = require("../decorators")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if (user) {
        throw HttpError("409", "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const result = await User.create({...req.body, password: hashPassword})
    res.status(201).json({email: result.email})
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
        throw HttpError("401", "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
         throw HttpError("401", "Email or password is wrong")
    }

    const payload = { id: user._id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '20h' });
    await User.findByIdAndUpdate(user._id, { token });
    
    res.json({token, user: {email, subscription: user.subscription}})
}

const getCurrent = async (req, res, next) => {
    const {email, subscription} = req.user
    res.json({email, subscription})
}

const logout = async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null })
    res.status(204).json({"message": "No Content"})
}

const updateSubscription = async (req, res, next) => {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true })
    if (!result) {
    throw HttpError(404, "Not found")
    }
    res.json(result)
  }

module.exports = {
    register: controllersWrapper(register),
    login: controllersWrapper(login),
    getCurrent: controllersWrapper(getCurrent),
    logout: controllersWrapper(logout),
    updateSubscription: controllersWrapper(updateSubscription)
}
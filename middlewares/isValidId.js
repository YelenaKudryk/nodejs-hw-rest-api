const { isValidObjectId } = require("mongoose")
const {HttpError} =require("../helpers")

const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
        next(HttpError("404", `${id} has invalid format`))
    }
    next()
}

module.exports = isValidId
const {Contact} = require('../models/contact')
const { HttpError } = require('../helpers')
const {controllersWrapper} = require('../decorators')

const getAllContacts = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite} = req.query;
    const skip = (page - 1) * limit;
    
    if (favorite) {
        const result = await Contact.find({owner, favorite}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email")
        res.json(result)
    } else {
        const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email")
         res.json(result)
    }
}

const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId)
    if (!result) {
    throw HttpError(404, "Not found")
    }
    res.json(result)
}

const addNewContact = async (req, res, next) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({...req.body, owner})
    res.status(201).json(result)
}

const removeContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId)
    if (!result) {
    throw HttpError(404, "Not found")
    }
    res.status(200).json({"message": "contact deleted"})
}

const updateContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) {
    throw HttpError(404, "Not found")
    }
    res.json(result)
}

const updateFavorite = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
    throw HttpError(400, "Missing field favorite")
    }
    const { contactId } = req.params
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) {
    throw HttpError(404, "Not found")
    }
    res.json(result)
}
    
module.exports = {
    getAllContacts: controllersWrapper(getAllContacts),
    getContactById: controllersWrapper(getContactById),
    addNewContact: controllersWrapper(addNewContact),
    removeContactById: controllersWrapper(removeContactById),
    updateContactById: controllersWrapper(updateContactById),
    updateFavorite: controllersWrapper(updateFavorite)
}
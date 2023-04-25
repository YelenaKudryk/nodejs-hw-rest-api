const express = require('express')
const router = express.Router()
const {validateBody} = require('../../decorators')
const {schemas} = require('../../models/contact')
const { controllers } = require('../../controllers')
const {isValidId, authenticate} = require("../../middlewares")

router.get('/', authenticate, controllers.getAllContacts)

router.get('/:contactId', authenticate, isValidId, controllers.getContactById)

router.post('/', authenticate, validateBody(schemas.addSchema), controllers.addNewContact)

router.delete('/:contactId', authenticate, isValidId, controllers.removeContactById)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), controllers.updateContactById)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), controllers.updateFavorite)

module.exports = router

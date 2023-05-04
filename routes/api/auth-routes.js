const express = require('express')
const router = express.Router()
const { validateBody } = require('../../decorators')
const { schemas } = require('../../models')
const { authControllers } = require('../../controllers')
const {authenticate, upload} = require("../../middlewares")

router.post("/users/register", validateBody(schemas.registerSchema), authControllers.register)

router.get("/verify/:verificationToken", authControllers.verify)

router.post("/users/verify", validateBody(schemas.emailSchema), authControllers.resendVerifyEmail)

router.post("/users/login", validateBody(schemas.loginSchema), authControllers.login)

router.get("/users/current", authenticate, authControllers.getCurrent)

router.post("/users/logout", authenticate, authControllers.logout)

router.patch("/users", authenticate, validateBody(schemas.subscriptionSchema), authControllers.updateSubscription)

router.patch("/users/avatars", authenticate, upload.single("avatarURL"), authControllers.updateAvatar)

module.exports = router



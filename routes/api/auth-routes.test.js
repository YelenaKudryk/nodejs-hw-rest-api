const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../../app')
const { DB_HOST_TEST } = process.env
const {User} = require('../../models')

describe("test /api/auth/users/register route", () => {
    let server = null

    beforeAll(async () => {
        server = app.listen(3000)
        await mongoose.connect(DB_HOST_TEST)
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        server.close()
        await mongoose.connection.close()
    })

    test("test register route with correct data", async() => {
        const registerData = {
            "password": "wwww",
            "email": "wwww@mail.com",
            "subscription": "starter"
        }

        const res = await request(app).post('/api/auth/users/register').send(registerData)
        expect(res.statusCode).toBe(201)
        expect(res.body.email).toBe(registerData.email)
        // expect(res.body.subscription).toBe(registerData.subscription)

        const user = await User.findOne({ email: registerData.email })
        // expect(user.password).toBe(registerData.password)
    })
})
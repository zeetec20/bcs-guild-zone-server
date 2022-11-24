const app = require("../app")
const req = require('supertest')(app)
const { expect, describe, test } = require('@jest/globals')
const { faker } = require('@faker-js/faker')

describe('guild zone', () => {
    jest.setTimeout(10000)

    describe('get all games - /games', () => {
        test('success - get all games', async () => {
            const res = await req.get('/games').send()

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body.data) && Boolean(res.body.data.length)).toBe(true)
        })
    })

    describe('get all guild - /guilds', () => {
        test('success - get all guilds', async () => {
            const res = await req.get('/guilds').send()

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body.data) && Boolean(res.body.data.length)).toBe(true)
        })
    })

    describe('send message - /send-message', () => {
        test('success - send a message', async () => {
            const res = await req.post('/send-message').send({
                'name': faker.name.fullName(),
                'email': faker.internet.email(),
                'message': faker.lorem.lines(2),
            })

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')
        })

        test('failed - missing data', async () => {
            const res = await req.post('/send-message').send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })
    })
})
const app = require("../app")
const req = require('supertest')(app)
const { expect, describe, test, afterAll } = require('@jest/globals')
const { faker } = require('@faker-js/faker')
const { authentication } = require("../services")

describe('user', () => {
    jest.setTimeout(10000)
    const emailGuildManager = faker.internet.email()
    const passwordGuildManager = faker.internet.password(8)

    const nameGamer = faker.name.fullName()
    const emailGamer = faker.internet.email()
    const passwordGamer = faker.internet.password(8)

    let bearerGuildManager, bearerGamer

    afterAll(async () => {
        await authentication.removeUser(emailGuildManager)
        await authentication.removeUser(emailGamer)
    })

    describe('register guild manager - /guild-manager/register', () => {
        test('success - register guild manager', async () => {
            const res = await req.post('/guild-manager/register').send({
                'email': emailGuildManager,
                'password': passwordGuildManager
            })

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')
        })

        test('failed - missing data', async () => {
            const res = await req.post('/guild-manager/register').send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })

        test('failed - duplicate data', async () => {
            const res = await req.post('/guild-manager/register').send({
                'email': emailGuildManager,
                'password': passwordGuildManager
            })

            expect(res.statusCode).toBe(409)
            expect(res.body.status).toBe('CONFLICT')
        })
    })

    describe('register gamer - /gamer/register', () => {
        test('success - register gamer', async () => {
            const res = await req.post('/gamer/register').send({
                'name': nameGamer,
                'email': emailGamer,
                'password': passwordGamer
            })

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')
        })

        test('failed - missing data', async () => {
            const res = await req.post('/gamer/register').send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })

        test('failed - duplicate account', async () => {
            const res = await req.post('/gamer/register').send({
                'name': nameGamer,
                'email': emailGamer,
                'password': passwordGamer
            })

            expect(res.statusCode).toBe(409)
            expect(res.body.status).toBe('CONFLICT')
        })
    })

    describe('login - /login', () => {
        test('success - login as gamer', async () => {
            const res = await req.post('/login').send({
                'email': emailGamer,
                'password': passwordGamer
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.data.access_token != undefined).toBe(true)
            expect(res.body.data.token_type).toBe('Bearer')
            expect(Object.prototype.toString.call(res.body.data.expires_in)).toBe('[object String]')

            bearerGamer = res.body.data.access_token
        })

        test('success - login as guild manager', async () => {
            const res = await req.post('/login').send({
                'email': emailGuildManager,
                'password': passwordGuildManager
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.data.access_token != undefined).toBe(true)
            expect(res.body.data.token_type).toBe('Bearer')
            expect(Object.prototype.toString.call(res.body.data.expires_in)).toBe('[object String]')

            bearerGuildManager = res.body.data.access_token
        })

        test('failed - missing data', async () => {
            const res = await req.post('/login').send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })

        test('failed - password or email incorrect', async () => {
            const res = await req.post('/login').send({
                'email': emailGuildManager,
                'password': 'wrong_password'
            })

            expect(res.statusCode).toBe(401)
            expect(res.body.status).toBe('UNAUTHORIZED')
        })
    })

    describe('get user data - /user', () => {
        test('sucess - get data user gamer', async () => {
            const res = await req.get('/user').set('Authorization', `Bearer ${bearerGamer}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.data != undefined).toBe(true)
        })

        test('sucess - get data user guild manager', async () => {
            const res = await req.get('/user').set('Authorization', `Bearer ${bearerGuildManager}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.data != undefined).toBe(true)
        })

        test('failed - invalid access code', async () => {
            const res = await req.get('/user')

            expect(res.statusCode).toBe(401)
            expect(res.body.status).toBe('UNAUTHORIZED')
        })
    })
})
const app = require("../app")
const req = require('supertest')(app)
const { expect, describe, test, beforeAll, afterAll } = require('@jest/globals')
const { faker } = require('@faker-js/faker')
const { Member } = require("../models")
const { authentication, guildZone } = require("../services")

describe('guild', () => {
    let guild, bearerGamer, memberUserId, memberAnonUserId
    const [name, email, password] = [faker.name.fullName(), faker.internet.email().toLowerCase(), faker.internet.password(8)]
    jest.setTimeout(10000)

    beforeAll(async () => {
        const guilds = await guildZone.getAllGuilds()
        guild = guilds[Math.floor(Math.random() * guilds.length)]

        await authentication.registerGamer(name, email, password)
        bearerGamer = (await authentication.login(email, password)).access_token
    })

    afterAll(async () => {
        await authentication.removeUser(email)
        await (await Member.findById(memberUserId)).remove()
        await (await Member.findById(memberAnonUserId)).remove()
    })

    describe('get data guild - /guild/{guild}', () => {
        test('success - get data guild', async () => {
            const res = await req.get(`/guilds/${guild.id}`).set('Authorization', `Bearer ${bearerGamer}`)

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')
        })

        test('failed - invalid id guild', async () => {
            const res = await req.get('/guilds/wrong_id').set('Authorization', `Bearer ${bearerGamer}`)

            expect(res.statusCode).toBe(404)
            expect(res.body.status).toBe('NOT_FOUND')
        })

        test('failed - invalid access code', async () => {
            const res = await req.get(`/guilds/${guild.id}`)

            expect(res.statusCode).toBe(401)
            expect(res.body.status).toBe('UNAUTHORIZED')
        })
    })

    describe('join guild as user - /guild/{guild}/join', () => {
        test('success - join guild as user', async () => {
            const res = await req.post(`/guild/${guild.id}/join`)
                .set('Authorization', `Bearer ${bearerGamer}`)
                .send({
                    'experience': faker.lorem.lines(3),
                    'recent_game': guild.games[Math.floor(Math.random() * guild.games.length)].id
                })

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')

            memberUserId = res.body.data.id
        })

        test('failed - missing data', async () => {
            const res = await req.post(`/guild/${guild.id}/join`)
                .set('Authorization', `Bearer ${bearerGamer}`)
                .send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })

        test('failed - invalid access code', async () => {
            const res = await req.post(`/guild/${guild.id}/join`)
                .send({})

            expect(res.statusCode).toBe(401)
            expect(res.body.status).toBe('UNAUTHORIZED')
        })
    })

    describe('join guild as anonymous user - /guild/{guild}/join-anonnymous', () => {
        test('success - join guild as anonymous user', async () => {
            const res = await req.post(`/guild/${guild.id}/join-anonnymous`).send({
                'name': faker.name.fullName(),
                'email': faker.internet.email(),
                'experience': faker.lorem.lines(3),
                'recent_game': guild.games[Math.floor(Math.random() * guild.games.length)].id
            })

            expect(res.statusCode).toBe(200)
            expect(Object.prototype.toString.call(res.body.data)).toBe('[object Object]')

            memberAnonUserId = res.body.data.id
        })

        test('failed - missing data', async () => {
            const res = await req.post(`/guild/${guild.id}/join-anonnymous`).send({})

            expect(res.statusCode).toBe(400)
            expect(res.body.status).toBe('BAD_REQUEST')
        })
    })
})
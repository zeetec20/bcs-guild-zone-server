const fs = require('fs')

const crypto = require('crypto')
const env = ['.env.development', '.env.production']
const attribute_name = 'TOKEN_SECRET'

env.forEach(env => {
    const data = fs.readFileSync(env, 'utf-8').split('\n').map(line => {
        if (line.split('=')[0] == attribute_name) return `${attribute_name}=${crypto.randomBytes(64).toString('hex')}` 
        return line
    }).join('\n')
    fs.writeFileSync(env, data)
})

console.log('token secret refreshed')
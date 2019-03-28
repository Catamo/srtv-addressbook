/* eslint-env mocha */
const supertest = require('supertest')

describe('users-service', () => {
  const api = supertest('http://192.168.99.100:300')
  it('returns a 200 for a known user', (done) => {
    api.get('/users/')
      .expect(200, done)
  })
})

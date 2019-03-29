/* eslint-env mocha */
const request = require('supertest')
const server = require('../server/server')

describe('Users API', () => {
  let app = null
  let testUsers = [{
    'id': '3',
    'title': 'xXx: Reactivado',
    'format': 'IMAX',
    'releaseYear': 2017,
    'releaseMonth': 1,
    'releaseDay': 20
  }, {
    'id': '4',
    'title': 'Resident Evil: Capitulo Final',
    'format': 'IMAX',
    'releaseYear': 2017,
    'releaseMonth': 1,
    'releaseDay': 27
  }, {
    'id': '1',
    'title': 'Assasins Creed',
    'format': 'IMAX',
    'releaseYear': 2017,
    'releaseMonth': 1,
    'releaseDay': 6
  }]

  let testRepo = {
    getAllUsers () {
      return Promise.resolve(testUsers)
    },
    getUserById (id) {
      return Promise.resolve(testUsers.find(user => user.id === id))
    }
  }

  beforeEach(() => {
    return server.start({
      port: 3000,
      repo: testRepo
    }).then(serv => {
      app = serv
    })
  })

  afterEach(() => {
    app.close()
    app = null
  })

  it('can return all users', (done) => {
    request(app)
      .get('/users')
      .expect((res) => {
        res.body.should.containEql({
          'id': '1',
          'title': 'Assasins Creed',
          'format': 'IMAX',
          'releaseYear': 2017,
          'releaseMonth': 1,
          'releaseDay': 6
        })
      })
      .expect(200, done)
  })

  it('returns 200 for an known user', (done) => {
    request(app)
      .get('/users/1')
      .expect((res) => {
        res.body.should.containEql({
          'id': '1',
          'title': 'Assasins Creed',
          'format': 'IMAX',
          'releaseYear': 2017,
          'releaseMonth': 1,
          'releaseDay': 6
        })
      })
      .expect(200, done)
  })
})

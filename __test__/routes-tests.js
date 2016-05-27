'use strict'

const base_url = 'http://localhost:3001/api/'
const request = require('request')

jest.unmock('request')

describe('routes tests', () => {
	describe('GET /api/comments', () => {
		it('returns status code 200', (done) => {
			request.get(base_url + 'comments', (err, res, body) => {
				if (err) {
					console.log(err)
					throw err
				}
				expect(res.statusCode).toBe(200)
				done()
			})
			
		})
		it('returns some comments', (done) => {
			request.get(base_url + 'comments', (err, res, body) => {
				if (err) {
					console.log(err)
				}
		

			})
			done()
		})
	})
	describe('POST /api/signup', () => {
		it('creates a new user', (done) => {
			request.post({url: base_url + 'signup', form: {username: 'Testy McTestface', password: '123'}}, (err, res, body) => {
				console.log(res)
			})
			done()
		})
	})
})
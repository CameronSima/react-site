module.exports = {
  apiUrl: 'http://localhost:3001/api/',
  pollInterval: 5000,
  expressPort: 3001,
  webpackServerPort: 3000,
  testdb: 'testdb',

  auth: {
    facebookAuth: {
      clientID: '285831851754236',
      clientSecret: 'c7796427869d0fec3de6f19cd2e7b490',
      callbackURL: 'http://localhost:3001/api/auth/facebook/callback'

    }
  }
}
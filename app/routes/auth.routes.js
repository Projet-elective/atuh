const { verifySignUp } = require('../middleware')
const controller = require('../controllers/auth.controller')
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  )
  app.post('/api/auth/signin', controller.signin)
  app.delete('/api/auth/delete', controller.delete)
  app.patch('/api/auth/patchUser', controller.patchUser)
  app.patch('/api/auth/patchEmail', controller.patchEmail)
  app.patch('/api/auth/patchPassword', controller.patchPassword)
  app.patch('/api/auth/patchForBan', controller.patchForBan)
  app.patch('/api/auth/patchForDeBan', controller.patchForDeBan)
  app.get('/api/auth/getAllLastConnected', controller.getAllLastConnected)
  app.get('/api/auth/getid', controller.getid)
}

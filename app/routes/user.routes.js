const { authJwt } = require('../middleware')
const controller = require('../controllers/user.controller')
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.get('/api/test/all', controller.allAccess)
  app.get(
    '/api/test/client',
    [authJwt.verifyToken],
    controller.clientBoard
  )
  app.get(
    '/api/test/restaurant',
    [authJwt.verifyToken],
    controller.restaurantBoard
  )
  app.get(
    '/api/test/delivery',
    [authJwt.verifyToken],
    controller.deliveryBoard
  )
  app.get(
    '/api/test/dev',
    [authJwt.verifyToken],
    controller.devBoard
  )
  app.get(
    '/api/test/commercial',
    [authJwt.verifyToken],
    controller.commercialBoard
  )
  app.get(
    '/api/test/tech',
    [authJwt.verifyToken],
    controller.techBoard
  )
}

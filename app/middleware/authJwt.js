const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user
verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }
    req.userId = decoded.id
    next()
  })
}
isClient = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'client') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require client Role!'
      })
    })
  })
}
isRestaurant = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'restaurant') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require restaurant Role!'
      })
    })
  })
}
isDelivery = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'delivery') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require delivery Role!'
      })
    })
  })
}
isDev = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'dev') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require dev Role!'
      })
    })
  })
}
isCommercial = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'commercial') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require commercial Role!'
      })
    })
  })
}
isTech = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'tech') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require tech Role!'
      })
    })
  })
}
// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === 'moderator') {
//           next()
//           return
//         }
//         if (roles[i].name === 'admin') {
//           next()
//           return
//         }
//       }
//       res.status(403).send({
//         message: 'Require Moderator or Admin Role!'
//       })
//     })
//   })
// }
const authJwt = {
  verifyToken,
  isClient,
  isRestaurant,
  isDelivery,
  isDev,
  isTech,
  isCommercial
}
module.exports = authJwt

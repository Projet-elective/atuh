const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const UserRole = db.user_roles
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { verifyToken } = require('../middleware/authJwt')
const { user } = require('../models')
const sercret = 'sasori-secret-key'

/**
 * @api {post} /auth/signup
 * @apiName post
 * @apiGroup Auth
 * @apiParam {Object} username, email, password for creat user
 * @apiSuccess {Object} User was registered successfully!
 * @apiError err Return the error
 */
// Save User to Database
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    address: req.body.address
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: 'User was registered successfully!' })
          })
        })
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: 'User was registered successfully!' })
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {post} /auth/signin
 * @apiName signin
 * @apiGroup Auth
 * @apiParam {Object} username, password to connect
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Sign in with username
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password !'
        })
      }
      const now = new Date()
      await User.update({ lastConnection: now }, {
        where: {
          username: user.username
        }
      })

      const authorities = []
      await user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase())
        }
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, address: user.address, lastConnection: user.lastConnection, role: authorities }, sercret, {
          expiresIn: 86400 // 24 hours
        })
        // const verifyJWT = (token) => {
        //   let valid = false

        //   try {
        //     valid = jwt.verify(token, sercret)
        //   } catch {
        //     valid = false
        //   }
        //   return valid
        // }
        // const verify = verifyJWT(token)
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          address: user.address,
          lastConnection: user.lastConnection,
          roles: authorities,
          accessToken: token
          // validd: verify
        })
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {delete} /auth/delete
 * @apiName delete
 * @apiGroup Auth
 * @apiParam {Object} delete user
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Delete the user with his username
exports.delete = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password !'
        })
      }
      User.destroy({
        where: {
          username: user.username
        }
      }).then(
        () => res.status(200).send()
      )
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {patch} /auth/patchUser
 * @apiName patchUser
 * @apiGroup Auth
 * @apiParam {Object} change username with oldusername and newusername
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Patch the username of one user with his newusername
exports.patchUser = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ username: req.body.newusername }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send('Nom d\'utilisateur modifié')
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {patch} /auth/patchEmail
 * @apiName patchEmail
 * @apiGroup Auth
 * @apiParam {Object} change email with username and newemail
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Patch the email of one user with his username and new email
exports.patchEmail = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ email: req.body.newemail }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send('Adresse mail modifiée')
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
exports.patchAddress = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ email: req.body.newaddress }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send('Adresse modifiée')
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {patch} /auth/patchPassword
 * @apiName patchPassword
 * @apiGroup Auth
 * @apiParam {Object} change password with username and newpassword
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Patch the password of one user with his username and new password
exports.patchPassword = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ password: bcrypt.hashSync(req.body.newpassword, 8) }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send()
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {patch} /auth/patchForBan
 * @apiName patchForBan
 * @apiGroup Auth
 * @apiParam {Object} change ban state to true with username
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Patch the state ban of the user to true with his username
exports.patchForBan = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ isBan: true }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send()
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {patch} /auth/patchForDeBan
 * @apiName patchForDeBan
 * @apiGroup Auth
 * @apiParam {Object} change ban state to false with username
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Patch the state ban of the user to false with his username
exports.patchForDeBan = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      await User.update({ isBan: false }, {
        where: {
          username: user.username
        }
      })
      res.status(200).send()
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {get} /auth/getAllLastConnected
 * @apiName getAllLastConnected
 * @apiGroup Auth
 * @apiParam
 * @apiSuccess {.txt} Download the file
 * @apiError err Return the error
 */
// Get the list of last connected users
exports.getAllLastConnected = (req, res) => {
  const row = User.findOne({
    where: {
      username: 'req.body.username'
    }
  })
    .then(async user => {
      if (!user) {
        const username = await User.findAll({ attributes: ['username', 'lastConnection'] })
        const time = Date.now()
        const today = new Date(time)
        const formatedToday = today.toDateString()

        res.attachment('Log_Connection' + formatedToday + '.txt').send(username)
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {get} /auth/getAll
 * @apiName getAll
 * @apiGroup Auth
 * @apiParam
 * @apiSuccess {object} return all username
 * @apiError err Return the error
 */
// Get all username of the user
exports.getAll = (req, res) => {
  const row = User.findOne({
    where: {
      username: 'req.body.username'
    }
  })
    .then(async user => {
      if (!user) {
        const username = await User.findAll({ attributes: ['username'] })
        res.send(username)
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
/**
 * @api {get} /auth/getid
 * @apiName getid
 * @apiGroup auth
 * @apiParam {Object} id of the user
 * @apiSuccess {Object}
 * @apiError err Return the error
 */
// Get all id of the users
exports.getid = (req, res) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      const authorities = []
      await user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase())
        }

        res.status(200).send({
          roles: authorities[0]
        })
      })
    })

    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

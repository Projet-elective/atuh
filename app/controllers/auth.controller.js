const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { verifyToken } = require('../middleware/authJwt')
const { user } = require('../models')
const sercret = 'sasori-secret-key'
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
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
exports.signin = (req, res) => {
  User.findOne({
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

      const authorities = []
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase())
        }
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: authorities }, sercret, {
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
exports.patchUser = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      // const passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // )
      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: 'Invalid Password !'
      //   })
      // }
      User.update({ username: req.body.newusername }, {
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
exports.patchEmail = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      // const passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // )
      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: 'Invalid Password !'
      //   })
      // }
      User.update({ email: req.body.newemail }, {
        where: {
          email: user.email
        }
      }).then(
        () => res.status(200).send()
      )
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
exports.patchPassword = (req, res) => {
  const row = User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      // const passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // )
      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: 'Invalid Password !'
      //   })
      // }
      User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: {
          password: user.password
        }
      }).then(
        () => res.status(200).send()
      )
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

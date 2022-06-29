const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { verifyToken } = require('../middleware/authJwt')
const { user } = require('../models')
const { role } = require('../models')
const sercret = 'sasori-secret-key'

exports.getid = (req, res) => {
  const row = Role.findAll({})
  console.log(row)
  res.status(row)

  res.status(500).send(Error)
}

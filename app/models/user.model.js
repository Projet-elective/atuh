module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    username: {
      type: Sequelize.STRING || null
    },
    email: {
      type: Sequelize.STRING || null
    },
    password: {
      type: Sequelize.STRING || null
    }
  })
  return User
}

exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.')
}
exports.clientBoard = (req, res) => {
  res.status(200).send('Client Content.')
}
exports.restaurantBoard = (req, res) => {
  res.status(200).send('Restaurant Content.')
}
exports.deliveryBoard = (req, res) => {
  res.status(200).send('Delivery Content.')
}
exports.devBoard = (req, res) => {
  res.status(200).send('Dev Content.')
}
exports.commercialBoard = (req, res) => {
  res.status(200).send('Commercial Content.')
}
exports.techBoard = (req, res) => {
  res.status(200).send('Tech Content.')
}

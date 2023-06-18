const { Order } = require('../models');

const orderController = {
  getOrders: (req, res, next) => {
    Order.findAll({ raw: true })
    .then(orders => {
      res.render('users/order', {
        orders
      })
    })
    .catch(err => next(err))
  }
};

module.exports = orderController;

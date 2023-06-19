const { OrderDetail, Clothe, User, Order} = require('../models');
const {getUser} = require('../helpers/auth-helpers')

const orderDetailController = {
  getOrderDetails: (req, res, next) => {
    OrderDetail.findAll({
      where: { orderId: null },
      include: Clothe ,
      nest: true,
      raw: true
    })
    .then( orderDetails => {
      const total = orderDetails.reduce((acc, o) => {
        const price = Number(o.Clothe.price);
        const quantity = Number(o.quantity);
        return acc + price * quantity;
      }, 0)

      res.render('orderDetails', {
        orderDetails,
        total
      })
    })
    .catch(err => next(err))
  },
  postOrderDetail: async (req, res, next) => {
    try {
      const { clotheId, quantity } = req.body;
      const userId = getUser(req).id


      const [user, clothe, orderDetails] = await Promise.all([User.findByPk(userId),
        Clothe.findByPk(clotheId), 
        OrderDetail.findOne({
          where: { orderId: null, clotheId },
          include: Clothe
        })])


      if (!user) throw new Error("User didn't exist!")
      if (!clothe) throw new Error("Item didn't exist!")

      if (orderDetails) {
        orderDetails.quantity += Number(quantity);
        await orderDetails.save();
      } else {
        await OrderDetail.create({
          clotheId,
          quantity,
          userId
        });
      }

      req.flash('success_messages', 'Add to cart!');
      res.redirect(`/clothes/${clotheId}`);
    } catch (err) {
      next(err);
    }
  },
  deleteOrderDetail: (req, res, next) => {
    return OrderDetail.findByPk(req.params.id)
      .then(orderDetail => {
        if (!orderDetail) throw new Error("Item didn't exist!")
        return orderDetail.destroy()
      })
      .then(() => res.redirect('/orderDetails'))
      .catch(err => next(err))
  }
};

module.exports = orderDetailController;

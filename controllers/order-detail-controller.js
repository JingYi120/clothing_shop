const { OrderDetail, Clothe, User, Order} = require('../models');
const {getUser} = require('../helpers/auth-helpers')

const orderDetailController = {
  getOrderDetails: (req, res, next) => {
    const userId  = getUser(req).id
    return Promise.all([
      Order.findOne({
        where: { userId, isOrder: false },
        include: [ 
          { model: OrderDetail, include: Clothe }
        ]
      }), 
      User.findByPk(userId)
      ])

    .then(([ order, user ])=> {
      if (!user) throw new Error("User didn't exist!")

      let total = 0;
      if (order) {
        order.OrderDetails.forEach((orderDetail) => {
          const price = Number(orderDetail.Clothe.price);
          const quantity = Number(orderDetail.quantity);
          total += price * quantity;
        });

        return res.render('orderDetails', {
          order: order.toJSON(),
          user: user.toJSON(),
          userId,
          total
        })
      }
      return res.render('orderDetails')
    })
    .catch(err => next(err))
  },
  postOrderDetail: async (req, res, next) => {
    try {
      const { clotheId, quantity } = req.body;
      const userId = getUser(req).id

      const [user, clothe, orderDetail, order] = await Promise.all([
        User.findByPk(userId),
        Clothe.findByPk(clotheId), 
        OrderDetail.findOne({
          where: { isOrder: false, clotheId },
          include: [Clothe,Order],
        }), Order.findOne({
          where: { userId, isOrder: false },
        })])

      if (!user) throw new Error("User didn't exist!")
      if (!clothe) throw new Error("Item didn't exist!")

      let orderId =''
      if (!order) {
        const newOrder = await Order.create({ userId });
        orderId = newOrder.id;
      } else {
        orderId = order.id;
      }

      if (orderDetail && orderDetail.Order.userId === userId) {
        orderDetail.quantity += Number(quantity);
        await orderDetail.save();
      } else {
        await OrderDetail.create({
          clotheId,
          quantity,
          orderId
        });
      }

      req.flash('success_messages', 'Add to cart!');
      res.redirect(`/clothes/${clotheId}`);
    } catch (err) {
      next(err);
    }
  }

};

module.exports = orderDetailController;

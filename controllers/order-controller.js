const { OrderDetail, Clothe, User, Order } = require('../models');
const { getUser } = require('../helpers/auth-helpers')

const orderController = {
  editOrder: (req, res, next) => {
    const userId = getUser(req).id;
    Promise.all([
      Order.findByPk(req.params.id, {
        where: { userId, isOrder: false },
        include: [
          { model: OrderDetail, include: Clothe }
        ]
      }),
      User.findByPk(userId)
    ])
      .then(([order, user]) => {
        if (!user) throw new Error("User doesn't exist!");
        if (!order) throw new Error("Order not found!");
        
        res.render('edit-order', {
          order: order.toJSON(),
          user: user.toJSON(),
          userId,
        });
      })
      .catch(err => {
        next(err);
      });
  },
  putOrder: async(req, res, next) => {
    try{
      const { quantity } = req.body
      const userId = getUser(req).id
      const orderId = req.params.id
      const order = await Order.findByPk(orderId, {
        where: { userId, isOrder: false },
        include: [
          { model: OrderDetail, include: Clothe }
        ]
      })

      if (!order) throw new Error("Order doesn't exist!")

      const deletePromises = order.OrderDetails.map(async (od, i) => {
        if (quantity[i] <= 0) {
          await OrderDetail.destroy({ where: { id: od.id } });
        }
      })

      const updatePromises = order.OrderDetails.map(async (od, i) => {
        if (quantity[i] > 0) {
          await OrderDetail.update({ quantity: quantity[i] }, { where: { id: od.id } })
        }
      })
      await Promise.all([...deletePromises, ...updatePromises])

      res.redirect(`/orderDetails`)

    }catch(err){
      next(err)
    }
  },
  postOrder: async (req, res, next) => {
    try {
      const userId = getUser(req).id;
      const { note } = req.body;
      const order = await Order.findOne({
        where: { userId, isOrder: false }
      });
      console.log('order', order);

      await OrderDetail.update(
        { isOrder: true },
        { where: { orderId: order.id } }
      );
      await Order.update(
        { note, isOrder: true },
        { where: { id: order.id } }
      );

      req.flash('success_messages', 'The order has been successfully submitted.');
      res.redirect(`/clothes`);
    } catch (err) {
      next(err);
    }
  },

};

module.exports = orderController;

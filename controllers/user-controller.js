const bcrypt = require('bcryptjs')
const { User, Order, OrderDetail, Clothe } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const dayjs = require('dayjs')
const order = require('../models/order')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    if (!name || !email || !password || !passwordCheck) throw new Error('All fields are required!')

    User.findOne({ where: {email}})
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Registration successful!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successful!')
    res.redirect('/clothes')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successful!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        res.render('users/profile', {
          user: user.toJSON(),
        })
      })
      .catch(err => next(err))
  },
  getOrders: (req, res, next) => {
    const userId = getUser(req).id
    return Order.findAll({

      where: { userId }
    })
    .then(orders => {
      const result = orders.map(order => ({
        ...order.toJSON(),
        createdAt: dayjs(order.createdAt).format('YYYY-MM-DD') +'__'+ dayjs(order.createdAt).format('HH:mm:ss')
      }))

      res.render('users/orders', {
        orders: result
      })

    })
    .catch(err => next(err))
  },
  getOrder: (req, res, next) => {
    const user = getUser(req)
    return Order.findByPk(req.params.id,{ 
      include: [
        { model: OrderDetail, include: Clothe }
    ]})

      .then(order => {
        if (!order) throw new Error("Order didn't exist!");
        let total = 0;
          order.OrderDetails.forEach((orderDetail) => {
            const price = Number(orderDetail.Clothe.price);
            const quantity = Number(orderDetail.quantity);
            total += price * quantity;
          });


        res.render('users/order', { 
          order: order.toJSON(),
          user,
          total
        });
      })
      .catch(err => next(err));
  }
}
module.exports = userController
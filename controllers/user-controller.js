const bcrypt = require('bcryptjs')
const { User, Order, OrderDetail, Clothe, Favorite, Image } = require('../models')
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
  getUser: async(req, res, next) => {
    try{
      const user = await User.findByPk(req.params.id)

      if (!user) throw new Error("User didn't exist!")

      res.render('partials/user-profile', {
        user: user.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getOrders: async(req, res, next) => {
    try{
      const userId = getUser(req).id
      const orders = await Order.findAll({
        where: { userId }
      })
      const result = orders.map(order => ({
        ...order.toJSON(),
        createdAt: dayjs(order.createdAt).format('YYYY-MM-DD') + '__' + dayjs(order.createdAt).format('HH:mm:ss')
      }))

      res.render('users/orders', {
        orders: result
      })
    } catch (err) {
      next(err);
    }
  },
  getOrder: async(req, res, next) => {
    try{
      const user = getUser(req)
      const order = await Order.findByPk(req.params.id, {
          include: [{ model: OrderDetail, include: Clothe }]
        })

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
    } catch (err) {
      next(err);
    }
  },
  addFavorite: async(req, res, next) => {
    try{
      const { clotheId } = req.params
      const userId = getUser(req).id

      const [clothe, favorite] = await Promise.all([
        Clothe.findByPk(clotheId),
        Favorite.findOne({ where: { userId, clotheId} })
      ])
      if (!clothe) throw new Error("Item didn't exist!")
      if (favorite) throw new Error('You have favorited this item!')

      await Favorite.create({
        userId,
        clotheId
      })

      return res.json({ success: true })
    } catch (err) {
      next(err);
    }
  },
  removeFavorite: async(req, res, next) => {
    try{
      const { clotheId } = req.params
      const userId = getUser(req).id

      const favorite = await Favorite.findOne({
        where: { userId, clotheId }
      })

      if (!favorite) throw new Error("You haven't favorited this item")
      await favorite.destroy()
      return res.json({ success: true })
    } catch (err) {
      next(err);
    }
  },
  getFavorite: async(req, res, next) => {
    try{
      const userId = getUser(req).id
      const user =  await User.findByPk(userId, {
        include: { model: Clothe, as: 'FavoritedClothes', include: Image }
      })

      if (!user) throw new Error("User didn't exist!")

      res.render('users/favorite', {
        user: user.toJSON()
      })
    } catch (err) {
      next(err);
    }
  }
}
module.exports = userController
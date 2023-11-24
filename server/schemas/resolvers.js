const { AuthenticationError } = require('apollo-server-express');
const { Profile, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    categories: async () => await Category.find(),

    products: async (parent, { category, name }) => {
      const params = {};
      if (category) params.category = category;
      if (name) params.name = { $regex: name };

      return await Product.find(params).populate('category');
    },

    product: async (parent, { _id }) => await Product.findById(_id).populate('category'),

    Profile: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      const userProfile = await Profile.findById(context.user._id).populate({
        path: 'orders.products',
        populate: 'category'
      });

      userProfile.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
      return userProfile;
    },

    order: async (parent, { _id }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const user = await Profile.findById(context.user._id).populate('orders.products.category');
      return user.orders.id(_id);
    },

    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products });
      const line_items = [];
      const products = await Product.find({ _id: { $in: args.products } });

      for (const product of products) {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
          images: [`${url}/images/${product.image}`]
        });

        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: product.price * 100,
          currency: 'usd'
        });

        line_items.push({ price: price.id, quantity: 1 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      return { session: session.id };
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await Profile.create(args);
      return { token: signToken(user), user };
    },

    addOrder: async (parent, { products }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      const order = new Order({ products });
      await Profile.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
      return order;
    },

    updateUser: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(context.user._id, args, { new: true });
    },

    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;
      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },

    login: async (parent, { email, password }) => {
      const user = await Profile.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      return { token: signToken(user), user };
    }
  }
};

module.exports = resolvers;

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    _id: ID
    name: String
    description: String
    image: String
    quantity: Int
    price: Float
    category: Category
  }

  type Category {
    _id: ID
    name: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [Product]
  }

  type Profile {
    _id: ID
    firstName: String
    lastName: String
    email: String
    orders: [Order]
  }

  type Auth {
    token: ID
    user: Profile
  }

  type Checkout {
    session: ID
  }

  type Query {
    products(category: ID, name: String): [Product]
    categories: [Category]
    product(_id: ID!): Product
    Profile: Profile
    order(_id: ID!): Order
    checkout(products: [ID]!): Checkout
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addOrder(products: [ID]!): Order
    updateUser(firstName: String, lastName: String, email: String, password: String): Profile
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;

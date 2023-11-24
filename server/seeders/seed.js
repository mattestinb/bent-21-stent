const db = require('../config/connection');
const { Profile, Product, Category } = require('../models');
const profileSeeds = require('./profileSeeds.json');

db.once('open', async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany();
    await Profile.deleteMany({});

    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Beverages' },
      { name: 'Personal Care' },
      { name: 'Gadgets' },
      { name: 'Literature' },
      { name: 'Board Games' }
    ]);
    console.log('Categories seeded');

    // Seed Products
    const products = await Product.insertMany([
      {
        name: 'Organic Green Tea',
        price: 4.99,
        description: 'Refreshing and healthy green tea, naturally sourced.',
        image: 'green-tea.jpg',
        quantity: 300,
        category: categories[0]._id,
      },
      {
        name: 'Herbal Shampoo',
        category: categories[1]._id,
        description: 'Nourishing herbal shampoo for all hair types.',
        image: 'herbal-shampoo.jpg',
        price: 7.49,
        quantity: 150
      },
      {
        name: 'Smartwatch',
        category: categories[2]._id,
        description: 'Advanced smartwatch with health and fitness tracking.',
        image: 'smartwatch.jpg',
        price: 199.99,
        quantity: 40
      },
      {
        name: 'Mystery Novel',
        category: categories[3]._id,
        description: 'Gripping mystery novel with unexpected twists.',
        image: 'mystery-novel.jpg',
        price: 12.99,
        quantity: 80
      },
      {
        name: 'Chess Board',
        category: categories[4]._id,
        description: 'Classic wooden chess set for enthusiasts.',
        image: 'chess-board.jpg',
        price: 29.99,
        quantity: 60
      }
    ]);
    console.log('Products seeded');

    // Seed Profiles
    await Profile.create(profileSeeds);
    console.log('Users seeded');

    console.log('All done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});

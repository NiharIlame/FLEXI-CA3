const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Note = require('./models/Note');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/site_data');

    const email = 'demo.user@example.com';
    const password = 'demo1234';

    const existingUser = await User.findOne({ email });
    let user;

    if (!existingUser) {
      user = await User.create({
        name: 'Demo User',
        email,
        password,
      });
    } else {
      user = existingUser;
    }

    await Note.deleteMany({ user: user._id });

    await Note.insertMany([
      {
        title: 'Product launch ideas',
        content: 'Plan the launch checklist for the perfume catalog and highlight the best sellers.',
        subject: 'Marketing',
        user: user._id,
      },
      {
        title: 'Study schedule',
        content: 'Focus on chemistry and design work before the weekend review session.',
        subject: 'Academics',
        user: user._id,
      },
      {
        title: 'Personal notes',
        content: 'Book a fragrance consultation and compare top notes for evening events.',
        subject: 'Personal',
        user: user._id,
      },
    ]);

    console.log('Seeded demo user and notes successfully');
    console.log(`User email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();

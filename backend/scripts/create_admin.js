require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const User = require(path.join(__dirname, '..', 'models', 'User'));

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'Admin123!ChangeMe';
  const name = process.argv[4] || 'Administrator';

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User exists — updating to admin role and setting password.');
      user.role = 'admin';
      user.password = password;
      await user.save();
      console.log(`Updated existing user ${email} -> admin`);
    } else {
      user = new User({ email, password, name, role: 'admin' });
      await user.save();
      console.log(`Created admin user: ${email}`);
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }

  console.log('Done. You can now log in with the admin account.');
}

main();

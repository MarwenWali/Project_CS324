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

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    if (!admins.length) {
      console.log('No admin users found');
    } else {
      console.log('Admin users:');
      admins.forEach(a => console.log(`${a.email} (${a.name}) _id=${a._id}`));
    }
  } catch (err) {
    console.error('Error listing admins:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const riderUser = await db.collection('users').findOne({ role: 'delivery' });
  
  await db.collection('orders').updateOne(
    { _id: new mongoose.Types.ObjectId('6a83fbbd8159390e70b85c23') },
    {
      $set: {
        deliveryPartner: {
          _id: riderUser._id,
          name: riderUser.name,
          phone: riderUser.phone || '+91 98765 43210',
          vehicle: 'TVS Apache (DL 01 AB 1234)',
          avatar: riderUser.avatar,
          location: {
            type: 'Point',
            coordinates: [85.8589983, 20.2921899] // Rasulgarh Restaurant Origin
          }
        }
      }
    }
  );

  console.log('Successfully set driver location to Rasulgarh for order 6a83fbbd8159390e70b85c23');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

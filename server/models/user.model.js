import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  phone:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;

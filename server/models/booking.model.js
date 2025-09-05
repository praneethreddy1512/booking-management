import mongoose from 'mongoose';    

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SlotModel',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProviderModel',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled','pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
bookingSchema.index({ slotId: 1 }, { unique: true });

const BookingModel = mongoose.model('BookingModel', bookingSchema);

export default BookingModel;

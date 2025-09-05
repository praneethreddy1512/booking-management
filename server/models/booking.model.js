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
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: {
  type: String,
  default: "",
}

});

// Compound index for faster latest lookup
bookingSchema.index({ userId: 1, slotId: 1, providerId: 1, createdAt: -1 });

const BookingModel = mongoose.model('BookingModel', bookingSchema);
export default BookingModel;

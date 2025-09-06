import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProviderModel',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cancelled'],
    default: 'available'
  },
  price:{
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SlotModel = mongoose.model('SlotModel', slotSchema);

export default SlotModel;

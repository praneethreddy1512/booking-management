import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  workingHours: {
    start: { type: String, required: true, default: "09:00" },
    end: { type: String, required: true, default: "18:00" }
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProviderModel = mongoose.model('ProviderModel', providerSchema);

export default ProviderModel;

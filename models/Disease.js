import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 'dis_abhishyanda'
  name: { type: String, required: true }, // 'Abhishyanda'
  category: { type: String },
  description: { type: String },
  isCustom: { type: Boolean, default: false },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Disease', diseaseSchema);

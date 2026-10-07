import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('FollowUp', followUpSchema);

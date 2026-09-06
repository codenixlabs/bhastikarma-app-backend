import mongoose from 'mongoose';

const doseRuleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'dose_niruha_avara'
  bastiType: { type: String, required: true }, // 'Niruha', 'Anuvasana', 'Matra', 'Sharangadhara Niruha'
  bala: { type: String, required: true }, // 'Avara', 'Madhyama', 'Pravara'
  totalVolume: { type: Number },
  unit: { type: String, default: 'ml' },
  components: [{
    name: { type: String }, // 'Honey', 'Lavana', 'Sneha', etc.
    amount: { type: Number },
    unit: { type: String }
  }],
  sourceDocument: { type: String },
  sourceSection: { type: String }
}, { timestamps: true });

export default mongoose.model('DoseRule', doseRuleSchema);

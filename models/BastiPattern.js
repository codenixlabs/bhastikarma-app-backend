import mongoose from 'mongoose';

const bastiPatternSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // 'karma', 'kala', 'yoga'
  name: { type: String, required: true }, // 'Karma Basti'
  totalDays: { type: Number, required: true },
  recommendedBala: { type: String }, // 'Pravara', 'Madhyama', 'Avara'
  bastiType: { type: String }, // E.g., 'Niruha Basti + Anuvasana Basti', 'Yapana Basti'
  niruhaCount: { type: Number },
  anuvasanaCount: { type: Number },
  sequence: [{ type: String }], // Array of 'A', 'N', 'MB', 'YB'
  clinicalIndications: { type: String },
  sourceDocument: { type: String }
}, { timestamps: true });

export default mongoose.model('BastiPattern', bastiPatternSchema);

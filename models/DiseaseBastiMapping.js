import mongoose from 'mongoose';

const diseaseBastiMappingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 'map_001'
  diseaseId: { type: String, ref: 'Disease' }, 
  bastiId: { type: String, ref: 'BastiFormulation' },
  indicationStage: { type: String },
  bastiNameInSource: { type: String },
  classicalReferenceId: { type: String },
  sourceReference: { type: String },
  sourceText: { type: String }
}, { timestamps: true });

export default mongoose.model('DiseaseBastiMapping', diseaseBastiMappingSchema);

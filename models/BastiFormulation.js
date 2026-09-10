import mongoose from 'mongoose';

const bastiFormulationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 'basti_pancha_tikta_nb_ab'
  name: { type: String, required: true }, // 'Pancha tikta niruha'
  rawName: { type: String },
  bastiType: { type: String }, // 'Niruha Basti + Anuvasana Basti'
  formulationDetails: { type: String },
  ingredientsRaw: { type: String },
  formulationRecipeRaw: { type: String },
  isCrossReference: { type: Boolean },
  referencedCondition: { type: String },
  unresolvedReference: { type: Boolean },
  classicalReferenceIds: [{ type: String }],
  diseaseIds: [{ type: String, ref: 'Disease' }],
  sourceText: { type: String },
  recipeCompleteness: { type: String },
  ingredients: [{
    id: { type: String },
    name: { type: String },
    quantity: { type: String },
    unit: { type: String },
    category: { type: String },
    sourceText: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('BastiFormulation', bastiFormulationSchema);

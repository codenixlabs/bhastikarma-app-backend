import mongoose from 'mongoose';

const dailyObservationSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  
  // Niruha Samyak
  prasristaVinaMutra: { type: Boolean },
  sameerantwama: { type: Boolean },
  agniVriddhi: { type: Boolean },
  ruchi: { type: Boolean },
  ashayaLaghava: { type: Boolean },
  rogashanti: { type: Boolean },
  prakriti: { type: Boolean },
  bala: { type: Boolean },
  
  // Anuvasana Samyak
  sapurishaSnehaPratyeti: { type: Boolean },
  shariraLaghavta: { type: Boolean },
  srustachVega: { type: Boolean },
  vatanulomana: { type: Boolean },
  agnidipta: { type: Boolean },

  // Niruha Ayoga
  siroHridGudaVedana: { type: Boolean },
  sopha: { type: Boolean },
  pratishyaya: { type: Boolean },
  vikartika: { type: Boolean }, 
  hrullasa: { type: Boolean }, 
  marutaSanga: { type: Boolean },
  mutraSanga: { type: Boolean },
  shvaskashta: { type: Boolean },

  // Anuvasana Ayoga
  adhaSariraRuja: { type: Boolean },
  udaraRuja: { type: Boolean },
  bahuPrushthaRuja: { type: Boolean },
  parshvaRuja: { type: Boolean },
  rukshaGatra: { type: Boolean },
  rukshaSvara: { type: Boolean },
  vitSanga: { type: Boolean },

  // Niruha Atiyoga
  kaphaPittaVataRaktaKshayajVikara: { type: Boolean },
  supti: { type: Boolean },
  angamarda: { type: Boolean },
  vepathu: { type: Boolean },
  nidraNasha: { type: Boolean },
  balaNasha: { type: Boolean },
  tamaPravesha: { type: Boolean },
  unmada: { type: Boolean },
  hikka: { type: Boolean },

  // Anuvasana Atiyoga
  moha: { type: Boolean },
  sada: { type: Boolean },
  murchha: { type: Boolean }
}, { _id: false });

const pradhanaKarmaSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  diseaseId: { type: String, ref: 'Disease' },
  bastiPatternCode: { type: String, ref: 'BastiPattern' },
  bastiFormulationId: { type: String, ref: 'BastiFormulation' },
  customNotesOnDose: { type: String }, // For custom adjustments made by doctor
  
  observation: {
    adanakala: { type: String },
    pratyagamanaKala: { type: String },
    vega: { type: String },
    dailyObservations: [dailyObservationSchema]
  }

}, { timestamps: true });

export default mongoose.model('PradhanaKarma', pradhanaKarmaSchema);

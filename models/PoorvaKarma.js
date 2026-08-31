import mongoose from 'mongoose';

const poorvaKarmaSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  diagnosisList: { type: String }, // e.g. list of diseases from table

  // Niruha Eligibility (from cha si 1/34 & cha si 2/14)
  niruhaEligibility: {
    recentInternalSnehanaEtc: { type: Boolean },
    continuousVomitingEtc: { type: Boolean },
    historyOfMiscarriageOrPregnant: { type: Boolean },
    uncontrolledDiabetesHypertensionCkd: { type: Boolean },
    isEligible: { type: Boolean } // False if ANY of the above are true
  },

  // Anuvasana Eligibility (from cha si 2/17)
  anuvasanaEligibility: {
    hasAsthapanaContraindications: { type: Boolean },
    impairedDigestion: { type: Boolean },
    diarrhoeaOrHardBowel: { type: Boolean },
    intestinalWormsPleehaEtc: { type: Boolean },
    aruchiPoisoningCoryzaEtc: { type: Boolean },
    isEligible: { type: Boolean } // False if ANY of the above are true
  },

  // Pariksha
  pariksha: {
    prakriti: { type: String },
    sarataha: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    sanhanan: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    pramana: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    satva: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    satmya: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    aharaShakti: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    vyayamaShakti: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    vaya: { type: String }, // e.g. Age auto-filled
    jihwa: { type: String, enum: ['Nirlipta', 'Ishat Lipta', 'Lipta'] }
  },

  // Agni Assessment
  agniAssessment: {
    jaranShaktiScore: { type: Number, min: 0, max: 5 },
    abhyavaharanaShaktiScore: { type: Number, min: 0, max: 5 },
    ruchiScore: { type: Number, min: 0, max: 5 },
    totalScore: { type: Number },
    agniType: { type: String, enum: ['Avara Agni(mandagni)', 'Madhyam Agni(sama agni)', 'Pravar Agni(pravaragni)'] },
    recommendedDrugs: { type: String }
  },

  // Kostha Assessment
  kosthaAssessment: {
    bowelFrequencyScore: { type: Number, min: 1, max: 3 },
    consistencyScore: { type: Number, min: 1, max: 3 },
    urgencyScore: { type: Number, min: 1, max: 3 },
    patientExperienceScore: { type: Number, min: 1, max: 3 },
    foodHabitChangeScore: { type: Number, min: 1, max: 3 },
    totalScore: { type: Number },
    kosthaType: { type: String, enum: ['Krura kostha', 'Madhyam kostha', 'Mridu kostha'] }
  },

  // Saama Nirama Lakshana
  saamaNirama: {
    srotorodha: { type: Boolean },
    balabhransha: { type: Boolean },
    gaurava: { type: Boolean },
    alasya: { type: Boolean },
    anilaMudhata: { type: Boolean },
    apaki: { type: Boolean },
    nishthivana: { type: Boolean },
    malaSanga: { type: Boolean },
    aruchi: { type: Boolean },
    klama: { type: Boolean },
    deepanPachanaRequired: { type: Boolean } // True if ANY of the above are true
  },

  // Bala Assessment
  bala: { type: String, enum: ['Pravara', 'Madhyama', 'Avara'] }

}, { timestamps: true });

export default mongoose.model('PoorvaKarma', poorvaKarmaSchema);

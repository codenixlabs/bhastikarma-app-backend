import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  demographics: {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, enum: ['Male', 'Female', 'Other'] },
    religion: { type: String },
    occupation: { type: String },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorcee', 'Widowed'] },
    address: { type: String },
    phoneNo: { type: String },
  },

  // Hospital Info
  hospitalInfo: {
    admissionType: { type: String, enum: ['OPD', 'IPD'] },
    opdNumber: { type: String },
    ipdNumber: { type: String },
    clinicalDiseaseSelection: { type: String },
    customDiagnosis: { type: String }
  },

  ClinicalInformation: {
    chiefComplaints: { type: String, required: true },
    historyOfPresentIllness: { type: String },
    historyOfPastIllness: { type: String },
    familyHistory: { type: String }
  },

  // Personal History
  personalHistory: {
    ahara: { type: String, enum: ['Veg', 'Non-Veg', 'Mixed'] },
    vihara: { type: String },
    addiction: { type: String },
    bowelHabits: { type: String, enum: ['Regular', 'Irregular', 'Constipated', 'Watery', 'Others'] },
    nidra: { type: String, enum: ['Sound', 'Disturbed'] },
    urineFrequency: { type: String },
    bloodGroup: { type: String }
  },

  // Menstrual & Obstetric History
  menstrualAndObstetricHistory: {
    numberOfDelivery: { type: String },
    abortion: { type: String },
    surgicalIntervention: { type: String }
  },

  // General Examination
  generalExamination: {
    bp: { type: String },
    rr: { type: String },
    hr: { type: String },
    temperature: { type: String },
    weight: { type: Number },
    height: { type: Number },
    bmi: { type: Number }
  },

  // Rogi Pariksha
  rogiPariksha: {
    prakriti: { type: String },
    sarataha: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    sanhanan: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    pramana: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    satva: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    satmya: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    aharaShakti: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    vyayamaShakti: { type: String, enum: ['Pravara', 'Madhyam', 'Avara'] },
    vaya: { type: String, enum: ['Bala', 'Madhyam', 'Vridha'] },
    jihwa: { type: String, enum: ['Nirlipta', 'Ishat Lipta', 'Lipta'] },
    desha: { type: String, enum: ['Sadharan', 'Jangala', 'Anupa'] }
  },

  // Investigations
  investigations: {
    pathologicalRadiological: { type: String },
    photoUrl: { type: String },
    treatmentGiven: { type: String }
  },

  treatment: {
    type: String, required: true
  },

  assessmentStatus: {
    poorvaKarmaCompleted: { type: Boolean, default: false },
    pradhanaKarmaCompleted: { type: Boolean, default: false },
    paschataKarmaCompleted: { type: Boolean, default: false }
  }

}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);

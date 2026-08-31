import mongoose from 'mongoose';

const paschataKarmaSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Vyapada And Its Management
  vyapadaAndManagement: {
    niruhaVyapadaDetails: { type: String }, 
    anuvasanaVyapadaDetails: { type: String }
  },

  // Parihara Vishaya And Kala
  pariharaVishayaAndKala: {
    restrictionsFollowed: { type: Boolean },
    notes: { type: String }
  },
  
  // Diet Followed
  diet: {
    followedDiet: { type: Boolean },
    notes: { type: String }
  }

}, { timestamps: true });

export default mongoose.model('PaschataKarma', paschataKarmaSchema);

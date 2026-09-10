import mongoose from 'mongoose';

const paschataKarmaSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Vyapada And Its Management
  vyapadaAndManagement: {
    niruhaVyapada: { type: String, enum: ['ayoga', 'atiyoga', 'klama', 'adhmana', 'hikka', 'hadprapti', 'udavarta', 'pravahika', 'shiroArti', 'angaArti', 'parikartika', 'parisrava', 'none', ''] },
    anuvasanaVyapada: { type: String, enum: ['vatavrutaSneha', 'pittavrutaSneha', 'kaphavrutaSneha', 'annaVrutaSneha', 'purishaVrutaSneha', 'abhuktaPranita', 'none', ''] }
  }
}, { timestamps: true });

export default mongoose.model('PaschataKarma', paschataKarmaSchema);

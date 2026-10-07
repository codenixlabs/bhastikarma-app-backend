import FollowUp from '../models/FollowUp.js';

export const createOrUpdateFollowUp = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { notes } = req.body;
    const doctorId = req.user.id;

    if (!notes) {
      return res.status(400).json({ success: false, message: 'Notes are required' });
    }

    const followUp = await FollowUp.findOneAndUpdate(
      { patientId },
      { doctorId, notes },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getFollowUp = async (req, res) => {
  try {
    const { patientId } = req.params;

    const followUp = await FollowUp.findOne({ patientId });
    
    res.status(200).json({ success: true, data: followUp || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

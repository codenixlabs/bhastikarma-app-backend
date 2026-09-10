import PaschataKarma from '../models/PaschataKarma.js';

// @desc    Create or update Paschata Karma for a patient
// @route   PUT /api/paschata-karma/:patientId
// @access  Private/Doctor
export const createOrUpdatePaschatKarma = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;

    const {
      vyapadaAndManagement
    } = req.body;

    let paschatKarma = await PaschataKarma.findOne({ patientId });

    if (paschatKarma) {
      // Update existing record
      if (vyapadaAndManagement) {
        if (vyapadaAndManagement.niruhaVyapada !== undefined) {
            paschatKarma.vyapadaAndManagement.niruhaVyapada = vyapadaAndManagement.niruhaVyapada;
        }
        if (vyapadaAndManagement.anuvasanaVyapada !== undefined) {
            paschatKarma.vyapadaAndManagement.anuvasanaVyapada = vyapadaAndManagement.anuvasanaVyapada;
        }
      }

      // Update doctorId to the last one who modified
      paschatKarma.doctorId = doctorId;

      await paschatKarma.save();
      
      return res.status(200).json({
        success: true,
        message: 'Paschata Karma updated successfully',
        data: paschatKarma
      });
    }

    // Create new record
    paschatKarma = await PaschataKarma.create({
      patientId,
      doctorId,
      vyapadaAndManagement: vyapadaAndManagement || {}
    });

    res.status(201).json({
      success: true,
      message: 'Paschata Karma created successfully',
      data: paschatKarma
    });
  } catch (error) {
    console.error(`Error in createOrUpdatePaschatKarma: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get Paschata Karma for a patient
// @route   GET /api/paschata-karma/:patientId
// @access  Private/Doctor
export const getPaschatKarma = async (req, res) => {
  try {
    const { patientId } = req.params;

    const paschatKarma = await PaschataKarma.findOne({ patientId })
      .populate('patientId', 'demographics.fullName')
      .populate('doctorId', 'name');

    if (!paschatKarma) {
      return res.status(404).json({ success: false, message: 'Paschata Karma record not found for this patient' });
    }

    res.status(200).json({
      success: true,
      data: paschatKarma
    });
  } catch (error) {
    console.error(`Error in getPaschatKarma: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

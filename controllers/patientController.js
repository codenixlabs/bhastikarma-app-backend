import Patient from '../models/Patient.js';
import { uploadFileToCloudinary } from '../utils/fileUploader.js';

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (Doctor/Admin)
export const createPatient = async (req, res) => {
    try {
        const patientData = { ...req.body };

        patientData.doctorId = req.user._id;

        if (req.files && req.files.photo) {
            const photoFile = req.files.photo;
            const uploadResult = await uploadFileToCloudinary(photoFile, "bhastikarma/patients");

            if (!patientData.investigations) {
                patientData.investigations = {};
            }
            patientData.investigations.photoUrl = uploadResult.secure_url;
        }

        const patient = await Patient.create(patientData);
        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        console.error("Error in createPatient:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get all patients for the logged-in doctor
// @route   GET /api/patients
// @access  Private (Doctor/Admin)
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({ doctorId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        console.error("Error in getPatients:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private (Doctor/Admin)
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.params.id, doctorId: req.user._id });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found or unauthorized' });
        }

        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error("Error in getPatientById:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private (Doctor/Admin)
export const updatePatient = async (req, res) => {
    try {
        let patient = await Patient.findOne({ _id: req.params.id, doctorId: req.user._id });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found or unauthorized' });
        }

        const updateData = { ...req.body };

        if (req.files && req.files.photo) {
            const photoFile = req.files.photo;
            const uploadResult = await uploadFileToCloudinary(photoFile, "bhastikarma/patients");

            if (!updateData.investigations) updateData.investigations = patient.investigations || {};
            updateData.investigations.photoUrl = uploadResult.secure_url;
        }

        patient = await Patient.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error("Error in updatePatient:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private (Doctor/Admin)
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({ _id: req.params.id, doctorId: req.user._id });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Patient removed successfully' });
    } catch (error) {
        console.error("Error in deletePatient:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

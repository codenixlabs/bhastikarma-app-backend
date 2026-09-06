import PradhanaKarma from '../models/PradhanaKarma.js';
import Patient from '../models/Patient.js';

// Helper function to get or create the PradhanaKarma document for a patient
const getOrCreatePradhanaKarma = async (patientId, doctorId) => {
    let pk = await PradhanaKarma.findOne({ patientId, doctorId });
    if (!pk) {
        pk = await PradhanaKarma.create({ patientId, doctorId });
    }
    return pk;
};



// @desc    Create or Update Pradhana Karma (General details)
// @route   PUT /api/pradhana-karma/:patientId
// @access  Private
export const createOrUpdatePradhanaKarma = async (req, res) => {
    try {
        const pk = await getOrCreatePradhanaKarma(req.params.patientId, req.user._id);
        
        const { 
            diseaseId,
            bastiPatternCode,
            bastiFormulationId,
            customNotesOnDose, 
            observation 
        } = req.body;

        if (diseaseId) pk.diseaseId = diseaseId;
        if (bastiPatternCode) pk.bastiPatternCode = bastiPatternCode;
        if (bastiFormulationId) pk.bastiFormulationId = bastiFormulationId;
        if (customNotesOnDose) pk.customNotesOnDose = customNotesOnDose;
        
        if (observation) {
            if (!pk.observation) pk.observation = {};
            if (observation.adanakala) pk.observation.adanakala = observation.adanakala;
            if (observation.pratyagamanaKala) pk.observation.pratyagamanaKala = observation.pratyagamanaKala;
            if (observation.vega) pk.observation.vega = observation.vega;
            // Note: dailyObservations are handled separately to allow pushing/updating individual days
        }

        await pk.save();
        res.status(200).json({ success: true, data: pk });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a Daily Observation
// @route   POST /api/pradhana-karma/:patientId/observations
// @access  Private
export const addDailyObservation = async (req, res) => {
    try {
        const pk = await getOrCreatePradhanaKarma(req.params.patientId, req.user._id);
        
        const observationData = req.body;
        
        if (!observationData.day) {
             return res.status(400).json({ success: false, message: 'Day number is required' });
        }
        
        if (!pk.observation) {
            pk.observation = { dailyObservations: [] };
        } else if (!pk.observation.dailyObservations) {
            pk.observation.dailyObservations = [];
        }

        // Check if observation for this day already exists
        const existingDayIndex = pk.observation.dailyObservations.findIndex(obs => obs.day === observationData.day);
        
        if (existingDayIndex !== -1) {
            // Update existing day
            pk.observation.dailyObservations[existingDayIndex] = {
                ...pk.observation.dailyObservations[existingDayIndex].toObject(),
                ...observationData
            };
        } else {
            // Add new day
            pk.observation.dailyObservations.push(observationData);
        }

        await pk.save();
        res.status(200).json({ success: true, data: pk.observation.dailyObservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a specific Daily Observation
// @route   PUT /api/pradhana-karma/:patientId/observations/:day
// @access  Private
export const updateDailyObservation = async (req, res) => {
    try {
        const pk = await PradhanaKarma.findOne({ patientId: req.params.patientId, doctorId: req.user._id });
        
        if (!pk || !pk.observation || !pk.observation.dailyObservations) {
            return res.status(404).json({ success: false, message: 'Pradhana Karma or observations not found' });
        }

        const day = parseInt(req.params.day);
        const observationIndex = pk.observation.dailyObservations.findIndex(obs => obs.day === day);

        if (observationIndex === -1) {
            return res.status(404).json({ success: false, message: `Observation for day ${day} not found` });
        }

        // Update the specific observation
        pk.observation.dailyObservations[observationIndex] = {
            ...pk.observation.dailyObservations[observationIndex].toObject(),
            ...req.body,
            day: day // ensure day isn't changed
        };

        await pk.save();
        res.status(200).json({ success: true, data: pk.observation.dailyObservations[observationIndex] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark Pradhana Karma as completed
// @route   PUT /api/pradhana-karma/:patientId/complete
// @access  Private
export const markPradhanaKarmaCompleted = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        
        // Ensure assessmentStatus exists
        if (!patient.assessmentStatus) {
            patient.assessmentStatus = {};
        }

        patient.assessmentStatus.pradhanaKarmaCompleted = true;
        await patient.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Pradhana Karma marked as completed', 
            data: patient.assessmentStatus 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

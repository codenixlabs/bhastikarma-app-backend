import BastiPattern from '../models/BastiPattern.js';
import DoseRule from '../models/DoseRule.js';
import BastiFormulation from '../models/BastiFormulation.js';
import Disease from '../models/Disease.js';
import DiseaseBastiMapping from '../models/DiseaseBastiMapping.js';

export const getPatterns = async (req, res) => {
  try {
    const { bastiType, bala, recommendedBala } = req.query;
    let query = {};
    if (bastiType) query.bastiType = bastiType;
    const targetBala = bala || recommendedBala;
    if (targetBala) query.recommendedBala = targetBala;

    const patterns = await BastiPattern.find(query);
    res.status(200).json({ success: true, count: patterns.length, data: patterns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getDoseRules = async (req, res) => {
  try {
    const { bastiType, bala } = req.query;
    let query = {};
    if (bastiType) query.bastiType = bastiType;
    if (bala) query.bala = bala;

    const rules = await DoseRule.find(query);
    res.status(200).json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getDiseases = async (req, res) => {
  try {
    const { patientId } = req.query;

    let query = { $or: [{ isCustom: { $ne: true } }] };
    if (patientId) {
      query.$or.push({ isCustom: true, patientId });
    }

    const diseases = await Disease.find(query);
    res.status(200).json({ success: true, count: diseases.length, data: diseases });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getFormulationsByDisease = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const { patientId } = req.query;

    const mappings = await DiseaseBastiMapping.find({ diseaseId }).lean();
    const bastiIds = mappings.map(m => m.bastiId);

    let queryConditions;

    if (patientId) {
      // When patientId is provided:
      // 1. All standard/classical formulations for this disease
      // 2. Custom formulations for this disease created for this patient (or general ones)
      queryConditions = [
        { id: { $in: bastiIds }, isCustom: { $ne: true } },
        {
          isCustom: true,
          diseaseIds: diseaseId,
          $or: [
            { patientId },
            { patientId: { $exists: false } },
            { patientId: null }
          ]
        }
      ];
    } else {
      // When no patientId is provided: return all standard and custom formulations for this disease
      queryConditions = [
        { id: { $in: bastiIds } },
        { diseaseIds: diseaseId }
      ];
    }

    const formulations = await BastiFormulation.find({ $or: queryConditions });

    res.status(200).json({ success: true, count: formulations.length, data: formulations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const addCustomDisease = async (req, res) => {
  try {
    const { name, patientId } = req.body;

    if (!name || !patientId) {
      return res.status(400).json({ success: false, message: 'Please provide name and patientId' });
    }

    const doctorId = req.user.id;
    const diseaseId = `custom_dis_${Date.now()}`;

    const customDisease = await Disease.create({
      id: diseaseId,
      name,
      patientId,
      doctorId,
      isCustom: true
    });

    res.status(201).json({ success: true, data: customDisease });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const addCustomFormulation = async (req, res) => {
  try {
    const diseaseId = req.params.diseaseId || req.body.diseaseId;
    const { name, rawName, title, patientId, bastiType, formulationDetails, ingredients } = req.body;

    // User provides name (also accept title if sent)
    const formulationName = name || title;
    if (!formulationName) {
      return res.status(400).json({ success: false, message: 'Please provide formulation name' });
    }

    const doctorId = req.user?.id || req.user?._id;
    const formulationId = `custom_formulation_${Date.now()}`;
    const defaultBastiType = bastiType || 'Niruha Basti + Anuvasana Basti';
    const formulationRawName = rawName || `${formulationName}. (NB+AB)`;

    // If patientId wasn't passed in body but diseaseId is a custom disease, inherit patientId automatically
    let targetPatientId = patientId;
    if (!targetPatientId && diseaseId) {
      const disease = await Disease.findOne({ id: diseaseId });
      if (disease && disease.patientId) {
        targetPatientId = disease.patientId;
      }
    }

    // Create the formulation directly under the selected disease and patient
    const customFormulation = await BastiFormulation.create({
      id: formulationId,
      name: formulationName,
      rawName: formulationRawName,
      bastiType: defaultBastiType,
      formulationDetails: formulationDetails || '',
      ingredients: ingredients || [],
      diseaseIds: diseaseId ? [diseaseId] : [],
      patientId: targetPatientId || undefined,
      doctorId,
      isCustom: true
    });

    // If diseaseId is selected, connect it in DiseaseBastiMapping so it appears immediately under that disease
    if (diseaseId) {
      await DiseaseBastiMapping.create({
        id: `map_${formulationId}_${Date.now()}`,
        diseaseId,
        bastiId: formulationId
      });
    }

    res.status(201).json({ success: true, data: customFormulation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getCustomFormulations = async (req, res) => {
  try {
    const { patientId, diseaseId } = req.query;
    const doctorId = req.user?.id || req.user?._id;

    let query = { isCustom: true };
    if (patientId) query.patientId = patientId;
    if (diseaseId) query.diseaseIds = diseaseId;
    if (doctorId) query.doctorId = doctorId;

    const formulations = await BastiFormulation.find(query);
    res.status(200).json({ success: true, count: formulations.length, data: formulations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

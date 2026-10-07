import BastiPattern from '../models/BastiPattern.js';
import DoseRule from '../models/DoseRule.js';
import BastiFormulation from '../models/BastiFormulation.js';
import Disease from '../models/Disease.js';
import DiseaseBastiMapping from '../models/DiseaseBastiMapping.js';

export const getPatterns = async (req, res) => {
  try {
    const patterns = await BastiPattern.find();
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
    
    // Check if it's a custom disease
    const disease = await Disease.findOne({ id: diseaseId });
    if (disease && disease.isCustom) {
      const customFormulation = {
        id: `custom_formulation_${diseaseId}`,
        name: 'Custom Formulation',
        bastiType: 'NB+AB'
      };
      return res.status(200).json({ success: true, count: 1, data: [customFormulation] });
    }
    
    const mappings = await DiseaseBastiMapping.find({ diseaseId }).lean();
    const bastiIds = mappings.map(m => m.bastiId);
    
    const formulations = await BastiFormulation.find({ id: { $in: bastiIds } });
        
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

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
    const diseases = await Disease.find();
    res.status(200).json({ success: true, count: diseases.length, data: diseases });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getFormulationsByDisease = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    
    const formulations = await BastiFormulation.find({ diseaseIds: diseaseId });
        
    res.status(200).json({ success: true, count: formulations.length, data: formulations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

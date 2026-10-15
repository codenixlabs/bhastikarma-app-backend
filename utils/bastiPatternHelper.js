import BastiPattern from '../models/BastiPattern.js';
import BastiFormulation from '../models/BastiFormulation.js';
import PoorvaKarma from '../models/PoorvaKarma.js';
import mongoose from 'mongoose';

/**
 * Normalizes any bastiType or formulation rawName string into the canonical BastiPattern.bastiType:
 * 1. 'Yapana Basti'
 * 2. 'Sneha Basti (Anuvasana / Matra)'
 * 3. 'Niruha Basti + Anuvasana Basti'
 */
export const normalizeBastiType = (bastiType = '', rawName = '') => {
  const combined = `${bastiType || ''} ${rawName || ''}`.toLowerCase();

  if (combined.includes('yapana') || combined.includes('yb') || combined.includes('only yb')) {
    return 'Yapana Basti';
  }
  if (
    combined.includes('sneha') ||
    combined.includes('matra') ||
    combined.includes('anuvasana') ||
    combined.includes('mb') ||
    combined.includes('only sneha')
  ) {
    return 'Sneha Basti (Anuvasana / Matra)';
  }
  if (
    combined.includes('niruha') ||
    combined.includes('nb') ||
    combined.includes('asthapana') ||
    combined.includes('nb+ab')
  ) {
    return 'Niruha Basti + Anuvasana Basti';
  }
  return 'Niruha Basti + Anuvasana Basti';
};

/**
 * Normalizes patient Bala string into: 'Pravara' | 'Madhyama' | 'Avara'
 */
export const normalizeBala = (bala = '') => {
  const b = (bala || '').trim().toLowerCase();
  if (b.startsWith('prav')) return 'Pravara';
  if (b.startsWith('madh')) return 'Madhyama';
  return 'Avara';
};

/**
 * Resolves the recommended BastiPattern document given bastiType and bala.
 */
export const resolveRecommendedPattern = async (bastiType, bala) => {
  const canonicalType = normalizeBastiType(bastiType);
  const canonicalBala = normalizeBala(bala);

  return await BastiPattern.findOne({
    bastiType: canonicalType,
    recommendedBala: canonicalBala
  }).lean();
};

/**
 * Resolves bastiType from bastiFormulationId (supports ObjectId or custom string ID)
 */
export const getBastiTypeFromFormulation = async (formulationId) => {
  if (!formulationId) return null;
  const query = mongoose.isValidObjectId(formulationId)
    ? { $or: [{ _id: formulationId }, { id: formulationId }] }
    : { id: formulationId };

  const formulation = await BastiFormulation.findOne(query).lean();
  if (!formulation) return null;

  return normalizeBastiType(formulation.bastiType, formulation.rawName);
};

/**
 * Resolves patient Bala from PoorvaKarma assessment
 */
export const getBalaFromPatient = async (patientId) => {
  if (!patientId) return null;
  const poorva = await PoorvaKarma.findOne({ patientId }).lean();
  if (!poorva || !poorva.bala) return null;

  return normalizeBala(poorva.bala);
};

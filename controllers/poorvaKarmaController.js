import PoorvaKarma from '../models/PoorvaKarma.js';

// Helper function to get or create the PoorvaKarma document for a patient
const getOrCreatePoorvaKarma = async (patientId, doctorId) => {
    let pk = await PoorvaKarma.findOne({ patientId, doctorId });
    if (!pk) {
        pk = await PoorvaKarma.create({ patientId, doctorId });
    }
    return pk;
};

// @desc    Update Niruha Eligibility
// @route   PUT /api/poorva-karma/:patientId/niruha
// @access  Private
export const updateNiruhaEligibility = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { 
            recentInternalSnehanaEtc, continuousVomitingEtc, 
            historyOfMiscarriageOrPregnant, uncontrolledDiabetesHypertensionCkd 
        } = req.body;

        // Calculate eligibility: if ANY is true, then NOT eligible.
        const isEligible = !(recentInternalSnehanaEtc || continuousVomitingEtc || 
                             historyOfMiscarriageOrPregnant || uncontrolledDiabetesHypertensionCkd);

        pk.niruhaEligibility = {
            recentInternalSnehanaEtc,
            continuousVomitingEtc,
            historyOfMiscarriageOrPregnant,
            uncontrolledDiabetesHypertensionCkd,
            isEligible
        };

        await pk.save();
        res.status(200).json({ success: true, isEligible, message: isEligible ? 'Eligible' : 'Not Eligible' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Anuvasana Eligibility
// @route   PUT /api/poorva-karma/:patientId/anuvasana
// @access  Private
export const updateAnuvasanaEligibility = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { 
            hasAsthapanaContraindications, impairedDigestion, 
            diarrhoeaOrHardBowel, intestinalWormsPleehaEtc, aruchiPoisoningCoryzaEtc 
        } = req.body;

        // Calculate eligibility: if ANY is true, then NOT eligible.
        const isEligible = !(hasAsthapanaContraindications || impairedDigestion || 
                             diarrhoeaOrHardBowel || intestinalWormsPleehaEtc || aruchiPoisoningCoryzaEtc);

        pk.anuvasanaEligibility = {
            hasAsthapanaContraindications,
            impairedDigestion,
            diarrhoeaOrHardBowel,
            intestinalWormsPleehaEtc,
            aruchiPoisoningCoryzaEtc,
            isEligible
        };

        await pk.save();
        res.status(200).json({ success: true, isEligible, message: isEligible ? 'Eligible' : 'Not Eligible' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Pariksha
// @route   PUT /api/poorva-karma/:patientId/pariksha
// @access  Private
export const updatePariksha = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { 
            prakriti, sarataha, sanhanan, pramana, 
            satva, satmya, aharaShakti, vyayamaShakti, vaya, jihwa 
        } = req.body;

        pk.pariksha = {
            prakriti, sarataha, sanhanan, pramana, 
            satva, satmya, aharaShakti, vyayamaShakti, vaya, jihwa
        };

        await pk.save();
        res.status(200).json({ success: true, data: pk.pariksha });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Agni Assessment
// @route   PUT /api/poorva-karma/:patientId/agni
// @access  Private
export const updateAgniAssessment = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { jaranShaktiScore = 0, abhyavaharanaShaktiScore = 0, ruchiScore = 0, recommendedDrugs } = req.body;

        const totalScore = Number(jaranShaktiScore) + Number(abhyavaharanaShaktiScore) + Number(ruchiScore);
        
        let agniType = '';
        if (totalScore <= 5) agniType = 'Avara Agni(mandagni)';
        else if (totalScore <= 10) agniType = 'Madhyam Agni(sama agni)';
        else agniType = 'Pravar Agni(pravaragni)';

        pk.agniAssessment = {
            jaranShaktiScore,
            abhyavaharanaShaktiScore,
            ruchiScore,
            totalScore,
            agniType,
            recommendedDrugs
        };

        await pk.save();
        res.status(200).json({ success: true, totalScore, agniType, data: pk.agniAssessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Kostha Assessment
// @route   PUT /api/poorva-karma/:patientId/kostha
// @access  Private
export const updateKosthaAssessment = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { bowelFrequencyScore = 1, consistencyScore = 1, urgencyScore = 1, 
                patientExperienceScore = 1, foodHabitChangeScore = 1 } = req.body;

        const totalScore = Number(bowelFrequencyScore) + Number(consistencyScore) + 
                           Number(urgencyScore) + Number(patientExperienceScore) + Number(foodHabitChangeScore);
        
        let kosthaType = '';
        if (totalScore <= 5) kosthaType = 'Krura kostha';
        else if (totalScore <= 10) kosthaType = 'Madhyam kostha';
        else kosthaType = 'Mridu kostha';

        pk.kosthaAssessment = {
            bowelFrequencyScore, consistencyScore, urgencyScore, 
            patientExperienceScore, foodHabitChangeScore,
            totalScore, kosthaType
        };

        await pk.save();
        res.status(200).json({ success: true, totalScore, kosthaType, data: pk.kosthaAssessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Saama Nirama Lakshana
// @route   PUT /api/poorva-karma/:patientId/saama-nirama
// @access  Private
export const updateSaamaNirama = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        
        const { 
            srotorodha, balabhransha, gaurava, alasya, anilaMudhata,
            apaki, nishthivana, malaSanga, aruchi, klama
        } = req.body;

        // If ANY symptom is true, Deepan Pachana is required
        const deepanPachanaRequired = (srotorodha || balabhransha || gaurava || alasya || 
                                       anilaMudhata || apaki || nishthivana || malaSanga || aruchi || klama);

        pk.saamaNirama = {
            srotorodha, balabhransha, gaurava, alasya, anilaMudhata,
            apaki, nishthivana, malaSanga, aruchi, klama,
            deepanPachanaRequired
        };

        await pk.save();
        res.status(200).json({ success: true, deepanPachanaRequired, data: pk.saamaNirama });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Bala
// @route   PUT /api/poorva-karma/:patientId/bala
// @access  Private
export const updateBala = async (req, res) => {
    try {
        const pk = await getOrCreatePoorvaKarma(req.params.patientId, req.user._id);
        pk.bala = req.body.bala;
        await pk.save();
        res.status(200).json({ success: true, bala: pk.bala });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

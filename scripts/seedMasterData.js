import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import BastiPattern from '../models/BastiPattern.js';
import DoseRule from '../models/DoseRule.js';
import BastiFormulation from '../models/BastiFormulation.js';
import Disease from '../models/Disease.js';
import DiseaseBastiMapping from '../models/DiseaseBastiMapping.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_DB_URL || "mongodb+srv://admin:admin123@cluster0.example.mongodb.net/bhastikarma?retryWrites=true&w=majority";

// Helper function to read json
const readJsonFile = (filename) => {
    const filePath = path.join(process.cwd(), 'data', 'seeds', filename);
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
};

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB...");

    // Clear existing data
    await BastiPattern.deleteMany();
    await DoseRule.deleteMany();
    await BastiFormulation.deleteMany();
    await Disease.deleteMany();
    await DiseaseBastiMapping.deleteMany();
    console.log("Cleared existing master data...");

    // 1. Seed Basti Patterns
    const patterns = readJsonFile('basti_patterns.json');
    await BastiPattern.insertMany(patterns);
    console.log(`Seeded ${patterns.length} Basti Patterns`);

    // 2. Seed Dose Rules
    const doseRules = readJsonFile('dose_rules.json');
    await DoseRule.insertMany(doseRules);
    console.log(`Seeded ${doseRules.length} Dose Rules`);

    // 3. Seed Basti Formulations
    const formulations = readJsonFile('basti_formulations.json');
    const ingredients = readJsonFile('basti_ingredients.json');
    const formulationsWithIngredients = formulations.map(f => {
      const fIng = ingredients.filter(i => i.bastiId === f.id);
      return { ...f, ingredients: fIng };
    });
    await BastiFormulation.insertMany(formulationsWithIngredients);
    console.log(`Seeded ${formulationsWithIngredients.length} Formulations with ingredients`);

    // 4. Seed Diseases
    const diseases = readJsonFile('diseases.json');
    await Disease.insertMany(diseases);
    console.log(`Seeded ${diseases.length} Diseases`);

    // 5. Seed Mappings
    const mappings = readJsonFile('disease_basti_mappings.json');
    await DiseaseBastiMapping.insertMany(mappings);
    console.log(`Seeded ${mappings.length} Disease-Basti Mappings`);

    console.log("Data seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

seedData();


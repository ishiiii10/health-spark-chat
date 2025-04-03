import mongoose from 'mongoose';

// Health Profile Schema
const healthProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  basicInfo: {
    age: Number,
    gender: String,
    height: Number, // in cm
    weight: Number, // in kg
    bloodType: String,
  },
  medicalHistory: {
    conditions: [String],
    allergies: [String],
    surgeries: [String],
    familyHistory: [String],
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
      },
    ],
  },
  lifestyle: {
    smokingStatus: String,
    alcoholConsumption: String,
    exerciseFrequency: String,
    diet: String,
    sleepHours: Number,
  },
  vitalSigns: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
healthProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export Health Profile model
const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

export default HealthProfile; 
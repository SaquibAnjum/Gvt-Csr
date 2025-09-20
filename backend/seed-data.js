const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Programme = require('./models/Programme');
const Beneficiary = require('./models/Beneficiary');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed sample data
const seedData = async () => {
  try {
    await connectDB();

    // Get the first programme
    const programme = await Programme.findOne();
    if (!programme) {
      console.log('No programme found. Please create a programme first.');
      return;
    }

    console.log('Found programme:', programme.name);

    // Create sample beneficiaries
    const sampleBeneficiaries = [
      {
        learner_id: 'LEARNER001',
        programme_id: programme._id,
        status: 'TRAINING',
        enrolled_at: new Date('2025-01-01'),
        districts: ['Pune']
      },
      {
        learner_id: 'LEARNER002',
        programme_id: programme._id,
        status: 'CERTIFIED',
        enrolled_at: new Date('2025-01-02'),
        districts: ['Pune']
      },
      {
        learner_id: 'LEARNER003',
        programme_id: programme._id,
        status: 'PLACED',
        enrolled_at: new Date('2025-01-03'),
        districts: ['Mumbai']
      },
      {
        learner_id: 'LEARNER004',
        programme_id: programme._id,
        status: 'TRAINING',
        enrolled_at: new Date('2025-01-04'),
        districts: ['Nashik']
      },
      {
        learner_id: 'LEARNER005',
        programme_id: programme._id,
        status: 'CERTIFIED',
        enrolled_at: new Date('2025-01-05'),
        districts: ['Mumbai']
      }
    ];

    // Clear existing beneficiaries for this programme
    await Beneficiary.deleteMany({ programme_id: programme._id });

    // Insert sample beneficiaries
    const beneficiaries = await Beneficiary.insertMany(sampleBeneficiaries);
    console.log(`Created ${beneficiaries.length} sample beneficiaries`);

    // Update programme districts to match the sample data
    await Programme.findByIdAndUpdate(programme._id, {
      districts: ['Pune', 'Mumbai', 'Nashik']
    });

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

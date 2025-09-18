const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  learner_id: {
    type: String,
    required: true
  },
  programme_id: {
    type: String,
    required: true,
    ref: 'Programme'
  },
  institution_id: {
    type: String,
    ref: 'Institution'
  },
  cohort_code: {
    type: String,
    trim: true
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  },
  eligibility: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['ENROLLED', 'TRAINING', 'CERTIFIED', 'PLACED', 'DROPPED'],
    default: 'ENROLLED'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound unique index for learner_id + programme_id
beneficiarySchema.index({ learner_id: 1, programme_id: 1 }, { unique: true });
beneficiarySchema.index({ programme_id: 1 });
beneficiarySchema.index({ institution_id: 1 });
beneficiarySchema.index({ status: 1 });
beneficiarySchema.index({ enrolled_at: 1 });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);

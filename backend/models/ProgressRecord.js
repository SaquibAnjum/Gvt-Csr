const mongoose = require('mongoose');

const progressRecordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  beneficiary_id: {
    type: String,
    required: true,
    ref: 'Beneficiary'
  },
  training_pct: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  last_assessment_id: {
    type: String
  },
  last_skillscore: {
    type: Number,
    min: 0,
    max: 100
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  milestones: [{
    type: {
      type: String,
      enum: ['TRAINING_STARTED', 'TRAINING_COMPLETED', 'ASSESSMENT_PASSED', 'CERTIFIED', 'PLACED']
    },
    achieved_at: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }]
}, {
  timestamps: { createdAt: false, updatedAt: 'last_updated' }
});

// Indexes
progressRecordSchema.index({ beneficiary_id: 1 });
progressRecordSchema.index({ last_updated: 1 });

module.exports = mongoose.model('ProgressRecord', progressRecordSchema);

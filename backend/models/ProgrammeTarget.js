const mongoose = require('mongoose');

const programmeTargetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  programme_id: {
    type: String,
    required: true,
    ref: 'Programme'
  },
  metric: {
    type: String,
    required: true,
    enum: ['TRAINED', 'CERTIFIED', 'PLACED', 'RETENTION_90D', 'SKILLSCORE_UPLIFT']
  },
  target_value: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Compound index for unique programme_id + metric combination
programmeTargetSchema.index({ programme_id: 1, metric: 1 }, { unique: true });

module.exports = mongoose.model('ProgrammeTarget', programmeTargetSchema);

const mongoose = require('mongoose');

const placementRecordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  beneficiary_id: {
    type: String,
    required: true,
    ref: 'Beneficiary'
  },
  job_id: {
    type: String
  },
  employer_id: {
    type: String
  },
  offer_date: {
    type: Date
  },
  join_date: {
    type: Date
  },
  ctc: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  location: {
    type: String,
    trim: true
  },
  retained_30d: {
    type: Boolean,
    default: false
  },
  retained_90d: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['OFFERED', 'JOINED', 'LEFT', 'RETAINED'],
    default: 'OFFERED'
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

// Indexes
placementRecordSchema.index({ beneficiary_id: 1 });
placementRecordSchema.index({ employer_id: 1 });
placementRecordSchema.index({ join_date: 1 });
placementRecordSchema.index({ status: 1 });

module.exports = mongoose.model('PlacementRecord', placementRecordSchema);

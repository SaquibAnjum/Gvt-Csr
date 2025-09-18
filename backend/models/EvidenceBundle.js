const mongoose = require('mongoose');

const evidenceBundleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  programme_id: {
    type: String,
    required: true,
    ref: 'Programme'
  },
  beneficiary_id: {
    type: String,
    ref: 'Beneficiary'
  },
  type: {
    type: String,
    required: true,
    enum: ['PROCTOR', 'ATTENDANCE', 'CREDENTIALS', 'FULL']
  },
  items: [{
    kind: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    ts: {
      type: Date,
      required: true
    },
    checksum: {
      type: String
    }
  }],
  generated_at: {
    type: Date,
    default: Date.now
  },
  requested_by: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['GENERATING', 'READY', 'EXPIRED', 'FAILED'],
    default: 'GENERATING'
  },
  download_count: {
    type: Number,
    default: 0
  },
  file_size: {
    type: Number
  }
}, {
  timestamps: { createdAt: 'generated_at', updatedAt: false }
});

// Indexes
evidenceBundleSchema.index({ programme_id: 1 });
evidenceBundleSchema.index({ beneficiary_id: 1 });
evidenceBundleSchema.index({ type: 1 });
evidenceBundleSchema.index({ expires_at: 1 });
evidenceBundleSchema.index({ status: 1 });

module.exports = mongoose.model('EvidenceBundle', evidenceBundleSchema);

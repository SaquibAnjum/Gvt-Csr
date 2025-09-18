const mongoose = require('mongoose');

const fundingRuleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  programme_id: {
    type: String,
    required: true,
    ref: 'Programme'
  },
  rule_type: {
    type: String,
    required: true,
    enum: ['PER_CERT', 'PER_PLACEMENT', 'RETENTION_BONUS']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  conditions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  active: {
    type: Boolean,
    default: true
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
fundingRuleSchema.index({ programme_id: 1 });
fundingRuleSchema.index({ rule_type: 1 });
fundingRuleSchema.index({ active: 1 });

module.exports = mongoose.model('FundingRule', fundingRuleSchema);

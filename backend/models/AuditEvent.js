const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  programme_id: {
    type: String,
    ref: 'Programme'
  },
  actor_id: {
    type: String,
    required: true
  },
  actor_role: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resource_type: {
    type: String,
    required: true
  },
  resource_id: {
    type: String
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Indexes for audit queries
auditEventSchema.index({ programme_id: 1 });
auditEventSchema.index({ actor_id: 1 });
auditEventSchema.index({ action: 1 });
auditEventSchema.index({ created_at: 1 });

module.exports = mongoose.model('AuditEvent', auditEventSchema);

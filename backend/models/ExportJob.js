const mongoose = require('mongoose');

const exportJobSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  programme_id: {
    type: String,
    required: true,
    ref: 'Programme'
  },
  format: {
    type: String,
    required: true,
    enum: ['CSV', 'PDF', 'NSDC', 'PMKVY', 'STATE']
  },
  destination: {
    type: String,
    required: true,
    enum: ['API', 'SFTP', 'EMAIL']
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  requested_by: {
    type: String,
    required: true
  },
  requested_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  },
  file_path: {
    type: String
  },
  error_message: {
    type: String
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  include_pii: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'requested_at', updatedAt: false }
});

// Indexes
exportJobSchema.index({ programme_id: 1 });
exportJobSchema.index({ status: 1 });
exportJobSchema.index({ requested_by: 1 });
exportJobSchema.index({ requested_at: 1 });

module.exports = mongoose.model('ExportJob', exportJobSchema);

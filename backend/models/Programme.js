const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  sponsor_type: {
    type: String,
    required: true,
    enum: ['GOV', 'CSR']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  sectors: [{
    type: String,
    trim: true
  }],
  districts: [{
    type: String,
    trim: true
  }],
  created_by: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
programmeSchema.index({ sponsor_type: 1 });
programmeSchema.index({ sectors: 1 });
programmeSchema.index({ districts: 1 });
programmeSchema.index({ created_by: 1 });

module.exports = mongoose.model('Programme', programmeSchema);

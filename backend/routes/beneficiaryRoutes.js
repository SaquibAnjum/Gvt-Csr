const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');
const ProgressRecord = require('../models/ProgressRecord');
const PlacementRecord = require('../models/PlacementRecord');
const AuditEvent = require('../models/AuditEvent');
const { validateBeneficiary } = require('../middleware/validation');

// Configure multer for CSV uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create a single beneficiary
router.post('/', validateBeneficiary, async (req, res) => {
  try {
    const beneficiary = new Beneficiary(req.body);
    await beneficiary.save();

    // Create initial progress record
    await new ProgressRecord({
      beneficiary_id: beneficiary._id,
      training_pct: 0
    }).save();

    // Log audit event
    await new AuditEvent({
      programme_id: beneficiary.programme_id,
      actor_id: req.body.created_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'ADD_BENEFICIARY',
      resource_type: 'BENEFICIARY',
      resource_id: beneficiary._id,
      meta: { learner_id: beneficiary.learner_id }
    }).save();

    res.status(201).json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get beneficiaries for a programme
router.get('/programme/:programmeId', async (req, res) => {
  try {
    const { status, q, page = 1, limit = 20 } = req.query;
    const { programmeId } = req.params;

    const filter = { programme_id: programmeId };
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { learner_id: { $regex: q, $options: 'i' } },
        { cohort_code: { $regex: q, $options: 'i' } }
      ];
    }

    const beneficiaries = await Beneficiary.find(filter)
      .sort({ enrolled_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('progress_record', 'training_pct last_skillscore last_updated milestones')
      .populate('placement_record', 'status ctc join_date retained_90d');

    const total = await Beneficiary.countDocuments(filter);

    res.json({
      success: true,
      data: beneficiaries,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get beneficiary by ID
router.get('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id)
      .populate('progress_record', 'training_pct last_skillscore last_updated milestones')
      .populate('placement_record', 'status ctc join_date retained_90d employer_id job_id');

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiary not found'
      });
    }

    res.json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update beneficiary status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, updated_by } = req.body;
    
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: new Date() },
      { new: true }
    );

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiary not found'
      });
    }

    // Log audit event
    await new AuditEvent({
      programme_id: beneficiary.programme_id,
      actor_id: updated_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'UPDATE_BENEFICIARY_STATUS',
      resource_type: 'BENEFICIARY',
      resource_id: beneficiary._id,
      meta: { old_status: req.body.old_status, new_status: status }
    }).save();

    res.json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Bulk import beneficiaries from CSV
router.post('/import/:programmeId', upload.single('file'), async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { created_by } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };

    const beneficiaries = [];
    const errors = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          results.total++;
          
          // Validate required fields
          if (!row.learner_id) {
            errors.push({
              row: results.total,
              error: 'learner_id is required',
              data: row
            });
            results.failed++;
            return;
          }

          beneficiaries.push({
            learner_id: row.learner_id,
            programme_id: programmeId,
            institution_id: row.institution_id || null,
            cohort_code: row.cohort_code || null,
            eligibility: row.eligibility ? JSON.parse(row.eligibility) : {},
            created_by: created_by || 'system'
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert beneficiaries in batches
    if (beneficiaries.length > 0) {
      try {
        await Beneficiary.insertMany(beneficiaries, { ordered: false });
        results.successful = beneficiaries.length;
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key errors
          const duplicateErrors = error.writeErrors || [];
          duplicateErrors.forEach(err => {
            errors.push({
              row: 'unknown',
              error: 'Duplicate learner_id for this programme',
              data: err.op
            });
          });
          results.failed += duplicateErrors.length;
          results.successful = beneficiaries.length - duplicateErrors.length;
        } else {
          throw error;
        }
      }

      // Create progress records for successful beneficiaries
      const progressRecords = beneficiaries.slice(0, results.successful).map(beneficiary => ({
        beneficiary_id: beneficiary._id,
        training_pct: 0
      }));
      
      if (progressRecords.length > 0) {
        await ProgressRecord.insertMany(progressRecords);
      }
    }

    results.errors = errors;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Log audit event
    await new AuditEvent({
      programme_id: programmeId,
      actor_id: created_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'BULK_IMPORT_BENEFICIARIES',
      resource_type: 'BENEFICIARY',
      meta: { 
        total_rows: results.total,
        successful: results.successful,
        failed: results.failed,
        filename: req.file.originalname
      }
    }).save();

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    // Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update progress record
router.post('/:id/progress', async (req, res) => {
  try {
    const { training_pct, last_assessment_id, last_skillscore, milestone } = req.body;
    
    const updateData = {
      training_pct,
      last_updated: new Date()
    };
    
    if (last_assessment_id) updateData.last_assessment_id = last_assessment_id;
    if (last_skillscore !== undefined) updateData.last_skillscore = last_skillscore;
    
    if (milestone) {
      updateData.$push = {
        milestones: {
          type: milestone.type,
          achieved_at: new Date(),
          metadata: milestone.metadata || {}
        }
      };
    }

    const progressRecord = await ProgressRecord.findOneAndUpdate(
      { beneficiary_id: req.params.id },
      updateData,
      { new: true, upsert: true }
    );

    // Update beneficiary status based on milestones
    if (milestone) {
      let newStatus = null;
      switch (milestone.type) {
        case 'TRAINING_STARTED':
          newStatus = 'TRAINING';
          break;
        case 'CERTIFIED':
          newStatus = 'CERTIFIED';
          break;
        case 'PLACED':
          newStatus = 'PLACED';
          break;
      }
      
      if (newStatus) {
        await Beneficiary.findByIdAndUpdate(req.params.id, { status: newStatus });
      }
    }

    res.json({
      success: true,
      data: progressRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add placement record
router.post('/:id/placement', async (req, res) => {
  try {
    const placementRecord = new PlacementRecord({
      ...req.body,
      beneficiary_id: req.params.id
    });
    await placementRecord.save();

    // Update beneficiary status
    await Beneficiary.findByIdAndUpdate(req.params.id, { status: 'PLACED' });

    res.json({
      success: true,
      data: placementRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

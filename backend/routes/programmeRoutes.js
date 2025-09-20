const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const ProgrammeTarget = require('../models/ProgrammeTarget');
const FundingRule = require('../models/FundingRule');
const AuditEvent = require('../models/AuditEvent');
const { validateProgramme, validateTarget, validateFundingRule } = require('../middleware/validation');

// Create a new programme
router.post('/', validateProgramme, async (req, res) => {
  try {
    const programme = new Programme(req.body);
    await programme.save();

    // Log audit event
    await new AuditEvent({
      programme_id: programme._id,
      actor_id: req.body.created_by,
      actor_role: 'PROGRAMME_MANAGER',
      action: 'CREATE_PROGRAMME',
      resource_type: 'PROGRAMME',
      resource_id: programme._id,
      meta: { programme_name: programme.name, programme_code: programme.code }
    }).save();

    res.status(201).json({
      success: true,
      data: programme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all programmes with filters
router.get('/', async (req, res) => {
  try {
    const { sponsor_type, sector, district, status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (sponsor_type) filter.sponsor_type = sponsor_type;
    if (sector) filter.sectors = { $in: [sector] };
    if (district) filter.districts = { $in: [district] };
    if (status) filter.status = status;

    const programmes = await Programme.find(filter)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Programme.countDocuments(filter);

    res.json({
      success: true,
      data: programmes,
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

// Get programme by ID
router.get('/:id', async (req, res) => {
  try {
    const programme = await Programme.findById(req.params.id);

    if (!programme) {
      return res.status(404).json({
        success: false,
        error: 'Programme not found'
      });
    }

    res.json({
      success: true,
      data: programme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update programme
router.patch('/:id', async (req, res) => {
  try {
    const programme = await Programme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!programme) {
      return res.status(404).json({
        success: false,
        error: 'Programme not found'
      });
    }

    // Log audit event
    await new AuditEvent({
      programme_id: programme._id,
      actor_id: req.body.updated_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'UPDATE_PROGRAMME',
      resource_type: 'PROGRAMME',
      resource_id: programme._id,
      meta: { changes: req.body }
    }).save();

    res.json({
      success: true,
      data: programme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete programme
router.delete('/:id', async (req, res) => {
  try {
    const programme = await Programme.findByIdAndDelete(req.params.id);

    if (!programme) {
      return res.status(404).json({
        success: false,
        error: 'Programme not found'
      });
    }

    // Delete related targets and funding rules
    await ProgrammeTarget.deleteMany({ programme_id: req.params.id });
    await FundingRule.deleteMany({ programme_id: req.params.id });

    // Log audit event
    await new AuditEvent({
      programme_id: req.params.id,
      actor_id: req.body.deleted_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'DELETE_PROGRAMME',
      resource_type: 'PROGRAMME',
      resource_id: req.params.id,
      meta: { programme_name: programme.name, programme_code: programme.code }
    }).save();

    res.json({
      success: true,
      message: 'Programme deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add programme targets
router.post('/:id/targets', validateTarget, async (req, res) => {
  try {
    const target = new ProgrammeTarget({
      ...req.body,
      programme_id: req.params.id
    });
    await target.save();

    // Log audit event
    await new AuditEvent({
      programme_id: req.params.id,
      actor_id: req.body.created_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'ADD_TARGET',
      resource_type: 'TARGET',
      resource_id: target._id,
      meta: { metric: target.metric, target_value: target.target_value }
    }).save();

    res.status(201).json({
      success: true,
      data: target
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add funding rules
router.post('/:id/funding-rules', validateFundingRule, async (req, res) => {
  try {
    const fundingRule = new FundingRule({
      ...req.body,
      programme_id: req.params.id
    });
    await fundingRule.save();

    // Log audit event
    await new AuditEvent({
      programme_id: req.params.id,
      actor_id: req.body.created_by || 'system',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'ADD_FUNDING_RULE',
      resource_type: 'FUNDING_RULE',
      resource_id: fundingRule._id,
      meta: { rule_type: fundingRule.rule_type, amount: fundingRule.amount }
    }).save();

    res.status(201).json({
      success: true,
      data: fundingRule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

const Joi = require('joi');

// Programme validation schema
const programmeSchema = Joi.object({
  sponsor_type: Joi.string().valid('GOV', 'CSR').required(),
  name: Joi.string().min(3).max(200).required(),
  code: Joi.string().min(2).max(20).required(),
  description: Joi.string().max(1000).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().min(Joi.ref('start_date')).required(),
  sectors: Joi.array().items(Joi.string()).min(1).required(),
  districts: Joi.array().items(Joi.string()).min(1).required(),
  created_by: Joi.string().required(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED').optional()
});

// Target validation schema
const targetSchema = Joi.object({
  metric: Joi.string().valid('TRAINED', 'CERTIFIED', 'PLACED', 'RETENTION_90D', 'SKILLSCORE_UPLIFT').required(),
  target_value: Joi.number().min(0).required()
});

// Funding rule validation schema
const fundingRuleSchema = Joi.object({
  rule_type: Joi.string().valid('PER_CERT', 'PER_PLACEMENT', 'RETENTION_BONUS').required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default('INR'),
  conditions: Joi.object().optional(),
  active: Joi.boolean().default(true)
});

// Beneficiary validation schema
const beneficiarySchema = Joi.object({
  learner_id: Joi.string().required(),
  programme_id: Joi.string().required(),
  institution_id: Joi.string().optional(),
  cohort_code: Joi.string().optional(),
  eligibility: Joi.object().optional()
});

// Validation middleware functions
const validateProgramme = (req, res, next) => {
  const { error } = programmeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

const validateTarget = (req, res, next) => {
  const { error } = targetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

const validateFundingRule = (req, res, next) => {
  const { error } = fundingRuleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

const validateBeneficiary = (req, res, next) => {
  const { error } = beneficiarySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateProgramme,
  validateTarget,
  validateFundingRule,
  validateBeneficiary
};

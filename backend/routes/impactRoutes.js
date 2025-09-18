const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const Beneficiary = require('../models/Beneficiary');
const ProgressRecord = require('../models/ProgressRecord');
const PlacementRecord = require('../models/PlacementRecord');
const ProgrammeTarget = require('../models/ProgrammeTarget');

// Get programme dashboard data
router.get('/dashboard/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { window = '30d', district, institution } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (window) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Build filter for beneficiaries
    const beneficiaryFilter = { programme_id: programmeId };
    if (district) beneficiaryFilter.districts = { $in: [district] };
    if (institution) beneficiaryFilter.institution_id = institution;

    // Get programme targets
    const targets = await ProgrammeTarget.find({ programme_id: programmeId });
    const targetMap = {};
    targets.forEach(target => {
      targetMap[target.metric] = target.target_value;
    });

    // Get beneficiary counts by status
    const statusCounts = await Beneficiary.aggregate([
      { $match: beneficiaryFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {};
    statusCounts.forEach(item => {
      statusMap[item._id] = item.count;
    });

    // Calculate KPIs
    const trained = (statusMap.TRAINING || 0) + (statusMap.CERTIFIED || 0) + (statusMap.PLACED || 0);
    const certified = statusMap.CERTIFIED || 0;
    const placed = statusMap.PLACED || 0;

    // Get skillscore data
    const skillscoreData = await ProgressRecord.aggregate([
      { $lookup: { from: 'beneficiaries', localField: 'beneficiary_id', foreignField: '_id', as: 'beneficiary' } },
      { $unwind: '$beneficiary' },
      { $match: { 'beneficiary.programme_id': programmeId, last_skillscore: { $exists: true, $ne: null } } },
      { $group: { _id: null, median: { $median: { input: '$last_skillscore', method: 'approximate' } } } }
    ]);

    // Get placement data for CTC calculation
    const placementData = await PlacementRecord.aggregate([
      { $lookup: { from: 'beneficiaries', localField: 'beneficiary_id', foreignField: '_id', as: 'beneficiary' } },
      { $unwind: '$beneficiary' },
      { $match: { 'beneficiary.programme_id': programmeId, ctc: { $exists: true, $ne: null } } },
      { $group: { _id: null, median: { $median: { input: '$ctc', method: 'approximate' } } } }
    ]);

    // Get district breakdown
    const districtBreakdown = await Beneficiary.aggregate([
      { $match: { programme_id: programmeId, status: { $in: ['CERTIFIED', 'PLACED'] } } },
      { $lookup: { from: 'programmes', localField: 'programme_id', foreignField: '_id', as: 'programme' } },
      { $unwind: '$programme' },
      { $unwind: '$programme.districts' },
      { $group: { 
        _id: '$programme.districts', 
        certified: { $sum: { $cond: [{ $eq: ['$status', 'CERTIFIED'] }, 1, 0] } },
        placed: { $sum: { $cond: [{ $eq: ['$status', 'PLACED'] }, 1, 0] } }
      }},
      { $sort: { certified: -1 } }
    ]);

    // Get trends data
    const trends = await getTrendsData(programmeId, startDate, endDate);

    const dashboard = {
      period: window,
      kpis: {
        trained: {
          value: trained,
          target: targetMap.TRAINED || 0,
          percentage: targetMap.TRAINED ? Math.round((trained / targetMap.TRAINED) * 100) : 0
        },
        certified: {
          value: certified,
          target: targetMap.CERTIFIED || 0,
          percentage: targetMap.CERTIFIED ? Math.round((certified / targetMap.CERTIFIED) * 100) : 0
        },
        placed: {
          value: placed,
          target: targetMap.PLACED || 0,
          percentage: targetMap.PLACED ? Math.round((placed / targetMap.PLACED) * 100) : 0
        },
        skillscore_uplift: {
          median: skillscoreData.length > 0 ? Math.round(skillscoreData[0].median * 100) / 100 : 0
        },
        median_ctc: {
          value: placementData.length > 0 ? Math.round(placementData[0].median) : 0
        }
      },
      breakdown: {
        by_district: districtBreakdown.map(item => ({
          code: item._id,
          certified: item.certified,
          placed: item.placed
        }))
      },
      trends: trends
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get cost KPIs
router.get('/cost-kpis/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;

    // Get funding rules
    const fundingRules = await FundingRule.find({ programme_id: programmeId, active: true });

    // Get beneficiary counts for cost calculation
    const beneficiaryCounts = await Beneficiary.aggregate([
      { $match: { programme_id: programmeId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {};
    beneficiaryCounts.forEach(item => {
      counts[item._id] = item.count;
    });

    // Calculate potential costs
    const costBreakdown = fundingRules.map(rule => {
      let eligibleCount = 0;
      switch (rule.rule_type) {
        case 'PER_CERT':
          eligibleCount = counts.CERTIFIED || 0;
          break;
        case 'PER_PLACEMENT':
          eligibleCount = counts.PLACED || 0;
          break;
        case 'RETENTION_BONUS':
          eligibleCount = counts.PLACED || 0; // Assuming all placed are eligible for retention bonus
          break;
      }

      return {
        rule_type: rule.rule_type,
        amount_per_unit: rule.amount,
        eligible_count: eligibleCount,
        total_potential: eligibleCount * rule.amount,
        currency: rule.currency
      };
    });

    const totalPotentialCost = costBreakdown.reduce((sum, item) => sum + item.total_potential, 0);

    res.json({
      success: true,
      data: {
        cost_breakdown: costBreakdown,
        total_potential_cost: totalPotentialCost,
        currency: 'INR'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get trends data
router.get('/trends/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { metric = 'PLACED', days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    const trends = await getTrendsData(programmeId, startDate, endDate, metric);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to get trends data
async function getTrendsData(programmeId, startDate, endDate, metric = null) {
  const pipeline = [
    { $match: { programme_id: programmeId } },
    { $lookup: { from: 'progressrecords', localField: '_id', foreignField: 'beneficiary_id', as: 'progress' } },
    { $lookup: { from: 'placementrecords', localField: '_id', foreignField: 'beneficiary_id', as: 'placement' } }
  ];

  if (metric) {
    switch (metric) {
      case 'TRAINED':
        pipeline.push({ $match: { status: { $in: ['TRAINING', 'CERTIFIED', 'PLACED'] } } });
        break;
      case 'CERTIFIED':
        pipeline.push({ $match: { status: 'CERTIFIED' } });
        break;
      case 'PLACED':
        pipeline.push({ $match: { status: 'PLACED' } });
        break;
    }
  }

  pipeline.push(
    { $group: { 
      _id: { 
        year: { $year: '$enrolled_at' },
        month: { $month: '$enrolled_at' },
        day: { $dayOfMonth: '$enrolled_at' }
      },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  );

  const trends = await Beneficiary.aggregate(pipeline);

  return trends.map(item => ({
    date: new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0],
    count: item.count
  }));
}

module.exports = router;

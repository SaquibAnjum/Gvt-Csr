const express = require('express');
const router = express.Router();
const ExportJob = require('../models/ExportJob');
const Programme = require('../models/Programme');
const Beneficiary = require('../models/Beneficiary');
const ProgressRecord = require('../models/ProgressRecord');
const PlacementRecord = require('../models/PlacementRecord');
const ProgrammeTarget = require('../models/ProgrammeTarget');
const AuditEvent = require('../models/AuditEvent');
const { v4: uuidv4 } = require('uuid');

// Create export job
router.post('/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { format, destination, schedule = 'NOW', include_pii = false, filters = {} } = req.body;

    // Validate programme exists
    const programme = await Programme.findById(programmeId);
    if (!programme) {
      return res.status(404).json({
        success: false,
        error: 'Programme not found'
      });
    }

    // Create export job
    const exportJob = new ExportJob({
      programme_id: programmeId,
      format: format,
      destination: destination,
      status: 'PENDING',
      requested_by: req.body.requested_by,
      filters: filters,
      include_pii: include_pii
    });

    await exportJob.save();

    // Start export job immediately if schedule is NOW
    if (schedule === 'NOW') {
      processExportJob(exportJob._id);
    }

    // Log audit event
    await new AuditEvent({
      programme_id: programmeId,
      actor_id: req.body.requested_by,
      actor_role: 'PROGRAMME_MANAGER',
      action: 'CREATE_EXPORT_JOB',
      resource_type: 'EXPORT_JOB',
      resource_id: exportJob._id,
      meta: { format, destination, include_pii }
    }).save();

    res.status(201).json({
      success: true,
      data: exportJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get export job status
router.get('/:jobId', async (req, res) => {
  try {
    const exportJob = await ExportJob.findById(req.params.jobId);
    
    if (!exportJob) {
      return res.status(404).json({
        success: false,
        error: 'Export job not found'
      });
    }

    res.json({
      success: true,
      data: exportJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get export jobs for a programme
router.get('/programme/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { status, format, page = 1, limit = 20 } = req.query;

    const filter = { programme_id: programmeId };
    if (status) filter.status = status;
    if (format) filter.format = format;

    const exportJobs = await ExportJob.find(filter)
      .sort({ requested_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ExportJob.countDocuments(filter);

    res.json({
      success: true,
      data: exportJobs,
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

// Download export file
router.get('/download/:jobId', async (req, res) => {
  try {
    const exportJob = await ExportJob.findById(req.params.jobId);
    
    if (!exportJob) {
      return res.status(404).json({
        success: false,
        error: 'Export job not found'
      });
    }

    if (exportJob.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Export job is not completed yet'
      });
    }

    if (!exportJob.file_path) {
      return res.status(404).json({
        success: false,
        error: 'Export file not found'
      });
    }

    // Log audit event
    await new AuditEvent({
      programme_id: exportJob.programme_id,
      actor_id: req.headers['x-user-id'] || 'anonymous',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'DOWNLOAD_EXPORT',
      resource_type: 'EXPORT_JOB',
      resource_id: exportJob._id,
      meta: { format: exportJob.format, include_pii: exportJob.include_pii }
    }).save();

    // In a real implementation, this would serve the actual file
    res.json({
      success: true,
      data: {
        download_url: `/api/exports/file/${exportJob._id}`,
        file_path: exportJob.file_path,
        format: exportJob.format
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Background function to process export job
async function processExportJob(jobId) {
  try {
    const exportJob = await ExportJob.findById(jobId);
    if (!exportJob) return;

    // Update status to processing
    exportJob.status = 'PROCESSING';
    await exportJob.save();

    // Get programme data
    const programme = await Programme.findById(exportJob.programme_id);
    if (!programme) {
      throw new Error('Programme not found');
    }

    // Get beneficiaries with filters
    const beneficiaryFilter = { programme_id: exportJob.programme_id };
    if (exportJob.filters.status) {
      beneficiaryFilter.status = exportJob.filters.status;
    }
    if (exportJob.filters.district) {
      beneficiaryFilter.districts = { $in: [exportJob.filters.district] };
    }
    if (exportJob.filters.institution) {
      beneficiaryFilter.institution_id = exportJob.filters.institution;
    }

    const beneficiaries = await Beneficiary.find(beneficiaryFilter);
    
    // Get related data
    const progressRecords = await ProgressRecord.find({
      beneficiary_id: { $in: beneficiaries.map(b => b._id) }
    });

    const placementRecords = await PlacementRecord.find({
      beneficiary_id: { $in: beneficiaries.map(b => b._id) }
    });

    const targets = await ProgrammeTarget.find({
      programme_id: exportJob.programme_id
    });

    // Generate export data based on format
    let exportData;
    let fileName;
    let mimeType;

    switch (exportJob.format) {
      case 'CSV':
        exportData = generateCSVExport(programme, beneficiaries, progressRecords, placementRecords, targets, exportJob.include_pii);
        fileName = `export_${programme.code}_${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case 'NSDC':
        exportData = generateNSDCExport(programme, beneficiaries, progressRecords, placementRecords, targets, exportJob.include_pii);
        fileName = `nsdc_export_${programme.code}_${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'PMKVY':
        exportData = generatePMKVYExport(programme, beneficiaries, progressRecords, placementRecords, targets, exportJob.include_pii);
        fileName = `pmkvy_export_${programme.code}_${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      default:
        throw new Error('Unsupported export format');
    }

    // In a real implementation, save to S3 or file system
    const filePath = `exports/${fileName}`;
    
    // Update export job with completion
    exportJob.status = 'COMPLETED';
    exportJob.completed_at = new Date();
    exportJob.file_path = filePath;
    await exportJob.save();

    console.log(`Export job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Error processing export job ${jobId}:`, error);
    
    // Update export job status to failed
    await ExportJob.findByIdAndUpdate(jobId, {
      status: 'FAILED',
      error_message: error.message
    });
  }
}

// Generate CSV export
function generateCSVExport(programme, beneficiaries, progressRecords, placementRecords, targets, includePII) {
  const headers = [
    'Programme Code',
    'Programme Name',
    'Beneficiary ID',
    'Status',
    'Enrolled Date',
    'Training %',
    'Last SkillScore',
    'Placement Status',
    'CTC',
    'Join Date'
  ];

  if (includePII) {
    headers.splice(2, 0, 'Learner ID', 'Institution ID', 'Cohort Code');
  }

  const rows = beneficiaries.map(beneficiary => {
    const progress = progressRecords.find(p => p.beneficiary_id === beneficiary._id);
    const placement = placementRecords.find(p => p.beneficiary_id === beneficiary._id);

    const row = [
      programme.code,
      programme.name,
      beneficiary._id,
      beneficiary.status,
      beneficiary.enrolled_at.toISOString().split('T')[0],
      progress ? progress.training_pct : 0,
      progress ? progress.last_skillscore || 0 : 0,
      placement ? placement.status : 'N/A',
      placement ? placement.ctc || 0 : 0,
      placement ? (placement.join_date ? placement.join_date.toISOString().split('T')[0] : 'N/A') : 'N/A'
    ];

    if (includePII) {
      row.splice(2, 0, beneficiary.learner_id, beneficiary.institution_id || 'N/A', beneficiary.cohort_code || 'N/A');
    }

    return row;
  });

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Generate NSDC format export
function generateNSDCExport(programme, beneficiaries, progressRecords, placementRecords, targets, includePII) {
  return {
    programme_info: {
      code: programme.code,
      name: programme.name,
      sponsor_type: programme.sponsor_type,
      sectors: programme.sectors,
      districts: programme.districts,
      start_date: programme.start_date,
      end_date: programme.end_date
    },
    targets: targets.map(target => ({
      metric: target.metric,
      target_value: target.target_value
    })),
    beneficiaries: beneficiaries.map(beneficiary => {
      const progress = progressRecords.find(p => p.beneficiary_id === beneficiary._id);
      const placement = placementRecords.find(p => p.beneficiary_id === beneficiary._id);

      const data = {
        beneficiary_id: beneficiary._id,
        status: beneficiary.status,
        enrolled_date: beneficiary.enrolled_at,
        training_progress: progress ? progress.training_pct : 0,
        skillscore: progress ? progress.last_skillscore : null,
        placement: placement ? {
          status: placement.status,
          ctc: placement.ctc,
          join_date: placement.join_date,
          retained_90d: placement.retained_90d
        } : null
      };

      if (includePII) {
        data.learner_id = beneficiary.learner_id;
        data.institution_id = beneficiary.institution_id;
        data.cohort_code = beneficiary.cohort_code;
      }

      return data;
    }),
    generated_at: new Date().toISOString(),
    include_pii: includePII
  };
}

// Generate PMKVY format export
function generatePMKVYExport(programme, beneficiaries, progressRecords, placementRecords, targets, includePII) {
  // PMKVY specific format - similar to NSDC but with PMKVY specific fields
  return {
    scheme_info: {
      scheme_name: 'PMKVY',
      programme_code: programme.code,
      programme_name: programme.name,
      implementing_agency: programme.sponsor_type === 'GOV' ? 'Government' : 'CSR Partner'
    },
    ...generateNSDCExport(programme, beneficiaries, progressRecords, placementRecords, targets, includePII)
  };
}

module.exports = router;

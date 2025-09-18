const express = require('express');
const router = express.Router();
const EvidenceBundle = require('../models/EvidenceBundle');
const Beneficiary = require('../models/Beneficiary');
const ProgressRecord = require('../models/ProgressRecord');
const PlacementRecord = require('../models/PlacementRecord');
const AuditEvent = require('../models/AuditEvent');
const { v4: uuidv4 } = require('uuid');

// Generate evidence bundle
router.post('/bundle/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { type = 'FULL', beneficiary_id, requested_by, expires_in_days = 7 } = req.body;

    // Validate programme exists
    const programme = await Programme.findById(programmeId);
    if (!programme) {
      return res.status(404).json({
        success: false,
        error: 'Programme not found'
      });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    // Create evidence bundle record
    const evidenceBundle = new EvidenceBundle({
      programme_id: programmeId,
      beneficiary_id: beneficiary_id || null,
      type: type,
      requested_by: requested_by,
      expires_at: expiresAt,
      status: 'GENERATING'
    });

    await evidenceBundle.save();

    // Start background job to generate bundle
    generateEvidenceBundle(evidenceBundle._id);

    // Log audit event
    await new AuditEvent({
      programme_id: programmeId,
      actor_id: requested_by,
      actor_role: 'PROGRAMME_MANAGER',
      action: 'GENERATE_EVIDENCE_BUNDLE',
      resource_type: 'EVIDENCE_BUNDLE',
      resource_id: evidenceBundle._id,
      meta: { type, beneficiary_id, expires_in_days }
    }).save();

    res.status(202).json({
      success: true,
      data: {
        bundle_id: evidenceBundle._id,
        status: 'GENERATING',
        expires_at: expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get evidence bundle status
router.get('/bundle/:bundleId', async (req, res) => {
  try {
    const { bundleId } = req.params;

    const bundle = await EvidenceBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        success: false,
        error: 'Evidence bundle not found'
      });
    }

    // Check if bundle has expired
    if (bundle.expires_at < new Date() && bundle.status === 'READY') {
      bundle.status = 'EXPIRED';
      await bundle.save();
    }

    res.json({
      success: true,
      data: bundle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download evidence bundle
router.get('/download/:bundleId', async (req, res) => {
  try {
    const { bundleId } = req.params;

    const bundle = await EvidenceBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        success: false,
        error: 'Evidence bundle not found'
      });
    }

    if (bundle.status !== 'READY') {
      return res.status(400).json({
        success: false,
        error: 'Bundle is not ready for download'
      });
    }

    if (bundle.expires_at < new Date()) {
      return res.status(410).json({
        success: false,
        error: 'Bundle has expired'
      });
    }

    // Increment download count
    bundle.download_count += 1;
    await bundle.save();

    // Log audit event
    await new AuditEvent({
      programme_id: bundle.programme_id,
      actor_id: req.headers['x-user-id'] || 'anonymous',
      actor_role: 'PROGRAMME_MANAGER',
      action: 'DOWNLOAD_EVIDENCE_BUNDLE',
      resource_type: 'EVIDENCE_BUNDLE',
      resource_id: bundleId,
      meta: { download_count: bundle.download_count }
    }).save();

    // Generate signed download URL (in a real implementation, this would be S3 signed URL)
    const downloadUrl = `/api/evidence/download-file/${bundleId}`;

    res.json({
      success: true,
      data: {
        download_url: downloadUrl,
        expires_at: bundle.expires_at,
        download_count: bundle.download_count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get evidence bundles for a programme
router.get('/programme/:programmeId', async (req, res) => {
  try {
    const { programmeId } = req.params;
    const { status, type, page = 1, limit = 20 } = req.query;

    const filter = { programme_id: programmeId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const bundles = await EvidenceBundle.find(filter)
      .sort({ generated_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EvidenceBundle.countDocuments(filter);

    res.json({
      success: true,
      data: bundles,
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

// Background function to generate evidence bundle
async function generateEvidenceBundle(bundleId) {
  try {
    const bundle = await EvidenceBundle.findById(bundleId);
    if (!bundle) return;

    const items = [];

    // Get programme data
    const programme = await Programme.findById(bundle.programme_id);
    if (programme) {
      items.push({
        kind: 'PROGRAMME_INFO',
        url: `programme_${bundle.programme_id}.json`,
        ts: new Date(),
        checksum: generateChecksum(programme)
      });
    }

    // Get beneficiary data
    const beneficiaryFilter = { programme_id: bundle.programme_id };
    if (bundle.beneficiary_id) {
      beneficiaryFilter._id = bundle.beneficiary_id;
    }

    const beneficiaries = await Beneficiary.find(beneficiaryFilter);
    for (const beneficiary of beneficiaries) {
      // Get progress records
      const progressRecord = await ProgressRecord.findOne({ beneficiary_id: beneficiary._id });
      if (progressRecord) {
        items.push({
          kind: 'PROGRESS_RECORD',
          url: `progress_${beneficiary._id}.json`,
          ts: progressRecord.last_updated,
          checksum: generateChecksum(progressRecord)
        });
      }

      // Get placement records
      const placementRecord = await PlacementRecord.findOne({ beneficiary_id: beneficiary._id });
      if (placementRecord) {
        items.push({
          kind: 'PLACEMENT_RECORD',
          url: `placement_${beneficiary._id}.json`,
          ts: placementRecord.created_at,
          checksum: generateChecksum(placementRecord)
        });
      }

      // Add beneficiary info
      items.push({
        kind: 'BENEFICIARY_INFO',
        url: `beneficiary_${beneficiary._id}.json`,
        ts: beneficiary.enrolled_at,
        checksum: generateChecksum(beneficiary)
      });
    }

    // Update bundle with generated items
    bundle.items = items;
    bundle.status = 'READY';
    bundle.file_size = calculateFileSize(items);
    await bundle.save();

    console.log(`Evidence bundle ${bundleId} generated successfully with ${items.length} items`);
  } catch (error) {
    console.error(`Error generating evidence bundle ${bundleId}:`, error);
    
    // Update bundle status to failed
    await EvidenceBundle.findByIdAndUpdate(bundleId, { 
      status: 'FAILED',
      error_message: error.message 
    });
  }
}

// Helper function to generate checksum
function generateChecksum(data) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// Helper function to calculate file size
function calculateFileSize(items) {
  // Rough estimation of file size
  return items.length * 1024; // 1KB per item estimate
}

module.exports = router;

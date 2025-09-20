import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  History,
  Calendar,
  User,
  CheckSquare,
  Square
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

const Evidence = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    programme: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch programmes for filter
  const { data: programmesData } = useQuery('programmes', async () => {
    const response = await fetch('/api/programmes')
    if (!response.ok) throw new Error('Failed to fetch programmes')
    return response.json()
  })

  // Fetch evidence bundles
  const { data: evidenceData, isLoading } = useQuery(
    ['evidence', filters],
    async () => {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.programme) params.append('programmeId', filters.programme)

      const response = await fetch(`/api/evidence/programme/${filters.programme || 'all'}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch evidence bundles')
      return response.json()
    }
  )

  // Generate evidence bundle mutation
  const generateBundle = useMutation(async (data) => {
    // Send only the fields that the backend expects
    const payload = {
      type: data.type,
      beneficiary_id: data.beneficiary_id || null,
      requested_by: 'current-user-id',
      expires_in_days: data.expires_in_days || 7
    }
    
    const response = await fetch(`/api/evidence/bundle/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate evidence bundle')
    }
    return response.json()
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('evidence')
      toast.success('Evidence bundle generation started')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const programmes = programmesData?.data || []
  const bundles = evidenceData?.data || []

  // Mock version history data
  const versionHistory = [
    { id: 1, version: 'v1.2', created: '2025-01-25', createdBy: 'John Doe', changes: 'Added proctoring logs for March batch', status: 'READY' },
    { id: 2, version: 'v1.1', created: '2025-01-20', createdBy: 'Jane Smith', changes: 'Updated attendance records', status: 'READY' },
    { id: 3, version: 'v1.0', created: '2025-01-15', createdBy: 'Mike Johnson', changes: 'Initial bundle creation', status: 'READY' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'GENERATING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'READY':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      GENERATING: 'bg-yellow-100 text-yellow-800',
      READY: 'bg-green-100 text-green-800',
      EXPIRED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800'
    }
    return `status-badge ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = async (bundleId) => {
    try {
      const response = await fetch(`/api/evidence/download/${bundleId}`)
      const result = await response.json()
      
      if (result.success) {
        // In a real app, this would trigger the actual download
        toast.success('Download started')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Download failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Evidence Center</h1>
          <p className="text-secondary-600">Generate and manage evidence bundles for audit</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowVersionHistory(true)}
            className="flex items-center space-x-1"
          >
            <History className="h-4 w-4" />
            <span>Version History</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowComplianceModal(true)}
            className="flex items-center space-x-1"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Compliance</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Create Bundle</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search evidence bundles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.programme}
              onChange={(e) => setFilters({ ...filters, programme: e.target.value })}
              className="input"
            >
              <option value="">All Programmes</option>
              {programmes.map((programme) => (
                <option key={programme._id} value={programme._id}>
                  {programme.name}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">All Status</option>
              <option value="GENERATING">Generating</option>
              <option value="READY">Ready</option>
              <option value="EXPIRED">Expired</option>
              <option value="FAILED">Failed</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="PROCTOR">Proctor</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="CREDENTIALS">Credentials</option>
              <option value="FULL">Full Bundle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div key={bundle._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {bundle.type} Bundle
                </h3>
                <p className="text-sm text-secondary-600 mb-2">
                  {bundle.programme_id ? `Programme: ${bundle.programme_id.slice(-8)}` : 'All Programmes'}
                </p>
                <div className="flex items-center">
                  {getStatusIcon(bundle.status)}
                  <span className={`ml-2 ${getStatusBadge(bundle.status)}`}>
                    {bundle.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-secondary-600">
              <div className="flex justify-between">
                <span>Generated:</span>
                <span>{formatDate(bundle.generated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{formatDate(bundle.expires_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{bundle.items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Downloads:</span>
                <span>{bundle.download_count || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleDownload(bundle._id)}
                disabled={bundle.status !== 'READY'}
                className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded">
                <Eye className="h-4 w-4 text-secondary-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {bundles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No evidence bundles found</h3>
          <p className="text-secondary-600 mb-4">Generate evidence bundles for audit and compliance</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Generate Bundle
          </button>
        </div>
      )}

      {/* Generate Bundle Modal */}
      {showCreateModal && (
        <GenerateBundleModal
          programmes={programmes}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries('evidence')
          }}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistoryModal
          versionHistory={versionHistory}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {/* Compliance Modal */}
      {showComplianceModal && (
        <ComplianceModal
          onClose={() => setShowComplianceModal(false)}
        />
      )}
    </div>
  )
}

// Version History Modal Component
const VersionHistoryModal = ({ versionHistory, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Bundle Version History"
      size="lg"
    >
      <div className="space-y-4">
        {versionHistory.map((version) => (
          <div key={version.id} className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Badge variant="success">{version.version}</Badge>
                <span className="font-medium text-secondary-900">{version.changes}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(version.created).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-secondary-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {version.createdBy}</span>
              </div>
              <Badge variant={version.status === 'READY' ? 'success' : 'warning'}>
                {version.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// Compliance Modal Component
const ComplianceModal = ({ onClose }) => {
  const [selectedScheme, setSelectedScheme] = useState('PMKVY')
  
  const complianceRequirements = {
    PMKVY: [
      { item: 'Beneficiary Registration with Aadhaar', required: true, completed: true },
      { item: 'Training Attendance Records (80% minimum)', required: true, completed: true },
      { item: 'Assessment Records & Certificates', required: true, completed: true },
      { item: 'Placement Verification Documents', required: true, completed: false },
      { item: 'Financial Disbursement Records', required: true, completed: true },
      { item: 'Training Provider Registration', required: true, completed: true },
      { item: 'Quality Assurance Reports', required: false, completed: true }
    ],
    DDUGKY: [
      { item: 'Beneficiary Registration Documents', required: true, completed: true },
      { item: 'Training Completion Certificates', required: true, completed: true },
      { item: 'Placement Verification Letters', required: true, completed: false },
      { item: 'Employer Verification Documents', required: true, completed: false },
      { item: 'Financial Utilization Certificates', required: true, completed: true }
    ]
  }

  const currentRequirements = complianceRequirements[selectedScheme] || []

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Compliance Checklist"
      size="xl"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Select Scheme</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="PMKVY">PMKVY (Pradhan Mantri Kaushal Vikas Yojana)</option>
            <option value="DDUGKY">DDUGKY (Deen Dayal Upadhyaya Grameen Kaushalya Yojana)</option>
          </select>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-secondary-900">
            {selectedScheme} Compliance Requirements
          </h3>
          {currentRequirements.map((requirement, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  requirement.completed ? 'bg-green-500 border-green-500' : 'border-secondary-300'
                }`}>
                  {requirement.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-secondary-900">{requirement.item}</span>
                  {requirement.required && (
                    <span className="ml-2 text-xs text-red-600 font-medium">Required</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={requirement.completed ? 'success' : 'warning'}>
                  {requirement.completed ? 'Completed' : 'Pending'}
                </Badge>
                <Button variant="secondary" size="sm">
                  {requirement.completed ? 'View' : 'Upload'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Compliance Status</h4>
          <div className="text-sm text-blue-800">
            <p>
              {currentRequirements.filter(r => r.required).length - currentRequirements.filter(r => r.required && r.completed).length} of {currentRequirements.filter(r => r.required).length} required items pending
            </p>
            <p className="mt-1">
              Overall compliance: {Math.round((currentRequirements.filter(r => r.required && r.completed).length / currentRequirements.filter(r => r.required).length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Generate Bundle Modal Component
const GenerateBundleModal = ({ programmes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    programmeId: '',
    type: 'FULL',
    beneficiary_id: '',
    expires_in_days: 7,
    customOptions: {
      attendanceSheets: true,
      proctoringLogs: true,
      credentials: true,
      progressReports: false,
      financialRecords: false,
      placementRecords: true
    },
    dateRange: {
      startDate: '',
      endDate: ''
    },
    specificBatch: ''
  })

  const generateBundle = useMutation(async (data) => {
    // Send only the fields that the backend expects
    const payload = {
      type: data.type,
      beneficiary_id: data.beneficiary_id || null,
      requested_by: 'current-user-id',
      expires_in_days: data.expires_in_days || 7
    }
    
    const response = await fetch(`/api/evidence/bundle/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate evidence bundle')
    }
    return response.json()
  }, {
    onSuccess: () => {
      toast.success('Evidence bundle generation started')
      onSuccess()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    generateBundle.mutate(formData)
  }

  const handleCustomOptionChange = (option) => {
    setFormData({
      ...formData,
      customOptions: {
        ...formData.customOptions,
        [option]: !formData.customOptions[option]
      }
    })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create Custom Evidence Bundle"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Programme</label>
            <select
              value={formData.programmeId}
              onChange={(e) => setFormData({ ...formData, programmeId: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Programme</option>
              {programmes.map((programme) => (
                <option key={programme._id} value={programme._id}>
                  {programme.name} ({programme.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Bundle Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="FULL">Full Bundle</option>
              <option value="PROCTOR">Proctor Only</option>
              <option value="ATTENDANCE">Attendance Only</option>
              <option value="CREDENTIALS">Credentials Only</option>
            </select>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Date Range (Optional)</label>
            <input
              type="date"
              value={formData.dateRange.startDate}
              onChange={(e) => setFormData({ 
                ...formData, 
                dateRange: { ...formData.dateRange, startDate: e.target.value }
              })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.dateRange.endDate}
              onChange={(e) => setFormData({ 
                ...formData, 
                dateRange: { ...formData.dateRange, endDate: e.target.value }
              })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Specific Batch (Optional)</label>
          <input
            type="text"
            value={formData.specificBatch}
            onChange={(e) => setFormData({ ...formData, specificBatch: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., BATCH-2025-01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Beneficiary ID (Optional)</label>
          <input
            type="text"
            value={formData.beneficiary_id}
            onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Leave empty for all beneficiaries"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Expires In (Days)</label>
          <select
            value={formData.expires_in_days}
            onChange={(e) => setFormData({ ...formData, expires_in_days: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={7}>7 days</option>
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={generateBundle.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={generateBundle.isLoading}
          >
            {generateBundle.isLoading ? 'Generating...' : 'Generate Bundle'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default Evidence

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
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

const Evidence = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    programme: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
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
    const response = await fetch(`/api/evidence/bundle/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        requested_by: 'current-user-id'
      })
    })
    if (!response.ok) throw new Error('Failed to generate evidence bundle')
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Bundle
        </button>
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
    </div>
  )
}

// Generate Bundle Modal Component
const GenerateBundleModal = ({ programmes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    programmeId: '',
    type: 'FULL',
    beneficiary_id: '',
    expires_in_days: 7
  })

  const generateBundle = useMutation(async (data) => {
    const response = await fetch(`/api/evidence/bundle/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        requested_by: 'current-user-id'
      })
    })
    if (!response.ok) throw new Error('Failed to generate evidence bundle')
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Generate Evidence Bundle</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Programme</label>
              <select
                value={formData.programmeId}
                onChange={(e) => setFormData({ ...formData, programmeId: e.target.value })}
                className="input"
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
              <label className="label">Bundle Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="FULL">Full Bundle</option>
                <option value="PROCTOR">Proctor Only</option>
                <option value="ATTENDANCE">Attendance Only</option>
                <option value="CREDENTIALS">Credentials Only</option>
              </select>
            </div>

            <div>
              <label className="label">Beneficiary ID (Optional)</label>
              <input
                type="text"
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="input"
                placeholder="Leave empty for all beneficiaries"
              />
            </div>

            <div>
              <label className="label">Expires In (Days)</label>
              <select
                value={formData.expires_in_days}
                onChange={(e) => setFormData({ ...formData, expires_in_days: parseInt(e.target.value) })}
                className="input"
              >
                <option value={7}>7 days</option>
                <option value={15}>15 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={generateBundle.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={generateBundle.isLoading}
                className="btn btn-primary"
              >
                {generateBundle.isLoading ? 'Generating...' : 'Generate Bundle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Evidence

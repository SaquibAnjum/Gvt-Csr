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
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

const Exports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    format: '',
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

  // Fetch export jobs
  const { data: exportsData, isLoading } = useQuery(
    ['exports', filters],
    async () => {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.format) params.append('format', filters.format)
      if (filters.programme) params.append('programmeId', filters.programme)

      const response = await fetch(`/api/exports/programme/${filters.programme || 'all'}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch export jobs')
      return response.json()
    }
  )

  // Create export job mutation
  const createExport = useMutation(async (data) => {
    const response = await fetch(`/api/exports/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        requested_by: 'current-user-id'
      })
    })
    if (!response.ok) throw new Error('Failed to create export job')
    return response.json()
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('exports')
      toast.success('Export job created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const programmes = programmesData?.data || []
  const exports = exportsData?.data || []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
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

  const handleDownload = async (jobId) => {
    try {
      const response = await fetch(`/api/exports/download/${jobId}`)
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
          <h1 className="text-3xl font-bold text-secondary-900">Exports</h1>
          <p className="text-secondary-600">Create and manage data exports for reporting</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Export
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
                placeholder="Search export jobs..."
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
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
            <select
              value={filters.format}
              onChange={(e) => setFilters({ ...filters, format: e.target.value })}
              className="input"
            >
              <option value="">All Formats</option>
              <option value="CSV">CSV</option>
              <option value="PDF">PDF</option>
              <option value="NSDC">NSDC</option>
              <option value="PMKVY">PMKVY</option>
              <option value="STATE">State Format</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Jobs */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Export ID</th>
                <th>Programme</th>
                <th>Format</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((exportJob) => (
                <tr key={exportJob._id}>
                  <td className="font-medium">{exportJob._id.slice(-8)}</td>
                  <td>
                    {programmes.find(p => p._id === exportJob.programme_id)?.name || 
                     exportJob.programme_id.slice(-8)}
                  </td>
                  <td>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {exportJob.format}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      {getStatusIcon(exportJob.status)}
                      <span className={`ml-2 ${getStatusBadge(exportJob.status)}`}>
                        {exportJob.status}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(exportJob.requested_at)}</td>
                  <td>
                    {exportJob.completed_at ? formatDate(exportJob.completed_at) : '-'}
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDownload(exportJob._id)}
                        disabled={exportJob.status !== 'COMPLETED'}
                        className="p-1 hover:bg-secondary-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4 text-secondary-500" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded">
                        <Eye className="h-4 w-4 text-secondary-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {exports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No export jobs found</h3>
            <p className="text-secondary-600 mb-4">Create export jobs to generate reports</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Export
            </button>
          </div>
        )}
      </div>

      {/* Create Export Modal */}
      {showCreateModal && (
        <CreateExportModal
          programmes={programmes}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries('exports')
          }}
        />
      )}
    </div>
  )
}

// Create Export Modal Component
const CreateExportModal = ({ programmes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    programmeId: '',
    format: 'CSV',
    destination: 'API',
    include_pii: false,
    schedule: 'NOW'
  })

  const createExport = useMutation(async (data) => {
    const response = await fetch(`/api/exports/${data.programmeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        requested_by: 'current-user-id'
      })
    })
    if (!response.ok) throw new Error('Failed to create export job')
    return response.json()
  }, {
    onSuccess: () => {
      toast.success('Export job created successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createExport.mutate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Create Export Job</h2>
          
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="input"
                >
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                  <option value="NSDC">NSDC</option>
                  <option value="PMKVY">PMKVY</option>
                  <option value="STATE">State Format</option>
                </select>
              </div>
              <div>
                <label className="label">Destination</label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="input"
                >
                  <option value="API">API</option>
                  <option value="SFTP">SFTP</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Schedule</label>
              <select
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="input"
              >
                <option value="NOW">Export Now</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="include_pii"
                checked={formData.include_pii}
                onChange={(e) => setFormData({ ...formData, include_pii: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="include_pii" className="ml-2 text-sm text-secondary-700">
                Include PII (Personal Identifiable Information)
              </label>
            </div>

            {formData.include_pii && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-2">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Including PII requires additional approval and compliance checks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={createExport.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createExport.isLoading}
                className="btn btn-primary"
              >
                {createExport.isLoading ? 'Creating...' : 'Create Export'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Exports

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  MoreVertical, 
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Award,
  Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'

const Beneficiaries = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    programme: '',
    institution: ''
  })
  const [selectedProgramme, setSelectedProgramme] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch programmes for filter
  const { data: programmesData } = useQuery('programmes', async () => {
    const response = await fetch('/api/programmes')
    if (!response.ok) throw new Error('Failed to fetch programmes')
    return response.json()
  })

  // Fetch beneficiaries
  const { data: beneficiariesData, isLoading } = useQuery(
    ['beneficiaries', selectedProgramme, filters, searchTerm],
    async () => {
      if (!selectedProgramme) return { data: [] }
      
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (searchTerm) params.append('q', searchTerm)

      const response = await fetch(`/api/beneficiaries/programme/${selectedProgramme}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch beneficiaries')
      return response.json()
    },
    { enabled: !!selectedProgramme }
  )

  // Update beneficiary status mutation
  const updateStatus = useMutation(async ({ id, status }) => {
    const response = await fetch(`/api/beneficiaries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, updated_by: 'current-user-id' })
    })
    if (!response.ok) throw new Error('Failed to update status')
    return response.json()
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('beneficiaries')
      toast.success('Status updated successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const programmes = programmesData?.data || []
  const beneficiaries = beneficiariesData?.data || []

  const getStatusBadge = (status) => {
    const statusClasses = {
      ENROLLED: 'status-enrolled',
      TRAINING: 'status-training',
      CERTIFIED: 'status-certified',
      PLACED: 'status-placed',
      DROPPED: 'status-dropped'
    }
    return `status-badge ${statusClasses[status] || 'status-enrolled'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = (id, newStatus) => {
    updateStatus.mutate({ id, status: newStatus })
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
          <h1 className="text-3xl font-bold text-secondary-900">Beneficiaries</h1>
          <p className="text-secondary-600">Manage programme beneficiaries</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-secondary flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </button>
          <button className="btn btn-primary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Programme Selection */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="label mb-0">Select Programme:</label>
          <select
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Choose a programme</option>
            {programmes.map((programme) => (
              <option key={programme._id} value={programme._id}>
                {programme.name} ({programme.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProgramme && (
        <>
          {/* Filters */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search beneficiaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="input"
                >
                  <option value="">All Status</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="TRAINING">Training</option>
                  <option value="CERTIFIED">Certified</option>
                  <option value="PLACED">Placed</option>
                  <option value="DROPPED">Dropped</option>
                </select>
                <button className="btn btn-secondary flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Beneficiaries Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Beneficiary ID</th>
                    <th>Learner ID</th>
                    <th>Status</th>
                    <th>Enrolled Date</th>
                    <th>Training %</th>
                    <th>SkillScore</th>
                    <th>Placement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary._id}>
                      <td className="font-medium">{beneficiary._id.slice(-8)}</td>
                      <td>{beneficiary.learner_id}</td>
                      <td>
                        <select
                          value={beneficiary.status}
                          onChange={(e) => handleStatusChange(beneficiary._id, e.target.value)}
                          className={`status-badge border-0 bg-transparent p-0 ${getStatusBadge(beneficiary.status)}`}
                        >
                          <option value="ENROLLED">Enrolled</option>
                          <option value="TRAINING">Training</option>
                          <option value="CERTIFIED">Certified</option>
                          <option value="PLACED">Placed</option>
                          <option value="DROPPED">Dropped</option>
                        </select>
                      </td>
                      <td>{formatDate(beneficiary.enrolled_at)}</td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-16 bg-secondary-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${beneficiary.progress_record?.[0]?.training_pct || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{beneficiary.progress_record?.[0]?.training_pct || 0}%</span>
                        </div>
                      </td>
                      <td>
                        {beneficiary.progress_record?.[0]?.last_skillscore ? 
                          `${beneficiary.progress_record[0].last_skillscore}%` : 
                          'N/A'
                        }
                      </td>
                      <td>
                        {beneficiary.placement_record?.[0] ? (
                          <div className="flex items-center text-green-600">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span className="text-sm">Placed</span>
                          </div>
                        ) : (
                          <span className="text-secondary-500 text-sm">Not Placed</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 hover:bg-secondary-100 rounded">
                            <Eye className="h-4 w-4 text-secondary-500" />
                          </button>
                          <button className="p-1 hover:bg-secondary-100 rounded">
                            <Edit className="h-4 w-4 text-secondary-500" />
                          </button>
                          <button className="p-1 hover:bg-red-100 rounded">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {beneficiaries.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No beneficiaries found</h3>
                <p className="text-secondary-600 mb-4">Import beneficiaries using CSV or add them manually</p>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn btn-primary"
                >
                  Import Beneficiaries
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedProgramme && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">Select a Programme</h3>
          <p className="text-secondary-600">Choose a programme to view its beneficiaries</p>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          programmeId={selectedProgramme}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false)
            queryClient.invalidateQueries('beneficiaries')
          }}
        />
      )}
    </div>
  )
}

// Import Modal Component
const ImportModal = ({ programmeId, onClose, onSuccess }) => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file || !programmeId) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('created_by', 'current-user-id')

    try {
      const response = await fetch(`/api/beneficiaries/import/${programmeId}`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(`Import completed: ${result.data.successful} successful, ${result.data.failed} failed`)
        onSuccess()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Import Beneficiaries</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="input"
              />
              <p className="text-sm text-secondary-500 mt-1">
                Upload a CSV file with columns: learner_id, institution_id, cohort_code
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">CSV Format</h4>
              <pre className="text-sm text-blue-800">
{`learner_id,institution_id,cohort_code
LRN001,INST001,COHORT-A
LRN002,INST001,COHORT-A
LRN003,INST002,COHORT-B`}
              </pre>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="btn btn-primary"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Beneficiaries

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Building2,
  TrendingUp,
  Users,
  Award,
  Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Programmes = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    sponsor_type: '',
    status: '',
    sector: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch programmes
  const { data: programmesData, isLoading } = useQuery('programmes', async () => {
    const params = new URLSearchParams()
    if (filters.sponsor_type) params.append('sponsor_type', filters.sponsor_type)
    if (filters.status) params.append('status', filters.status)
    if (filters.sector) params.append('sector', filters.sector)
    if (searchTerm) params.append('q', searchTerm)

    const response = await fetch(`/api/programmes?${params}`)
    if (!response.ok) throw new Error('Failed to fetch programmes')
    return response.json()
  })

  // Delete programme mutation
  const deleteProgramme = useMutation(async (id) => {
    const response = await fetch(`/api/programmes/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete programme')
    return response.json()
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('programmes')
      toast.success('Programme deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const programmes = programmesData?.data || []

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProgramme.mutate(id)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      DRAFT: 'bg-gray-100 text-gray-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return `status-badge ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" text="Loading programmes..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Programmes
          </h1>
          <p className="text-secondary-600 mt-2">Manage and track your skilling programmes</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Programme</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search programmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.sponsor_type}
              onChange={(e) => setFilters({ ...filters, sponsor_type: e.target.value })}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="GOV">Government</option>
              <option value="CSR">CSR</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button variant="secondary" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => (
          <Card key={programme._id} hover gradient className="group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {programme.name}
                  </h3>
                  <Badge variant={programme.status === 'ACTIVE' ? 'success' : programme.status === 'DRAFT' ? 'warning' : 'default'}>
                    {programme.status}
                  </Badge>
                </div>
                <p className="text-sm text-secondary-600 mb-3 font-mono">{programme.code}</p>
              </div>
              <div className="relative">
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-secondary-500" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-secondary-600">
                <div className="p-1.5 bg-primary-100 rounded-lg mr-3">
                  <Building2 className="h-4 w-4 text-primary-600" />
                </div>
                <span className="capitalize font-medium">{programme.sponsor_type}</span>
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span>{formatDate(programme.start_date)} - {formatDate(programme.end_date)}</span>
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span>{programme.districts.length} districts</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {programme.sectors.map((sector, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mock stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-lg font-bold text-secondary-900">812</span>
                </div>
                <p className="text-xs text-secondary-600">Trained</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-lg font-bold text-secondary-900">620</span>
                </div>
                <p className="text-xs text-secondary-600">Certified</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Briefcase className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-lg font-bold text-secondary-900">455</span>
                </div>
                <p className="text-xs text-secondary-600">Placed</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to={`/programmes/${programme._id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 text-sm font-medium"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Link>
              <div className="flex space-x-1">
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Edit className="h-4 w-4 text-secondary-500" />
                </button>
                <button 
                  onClick={() => handleDelete(programme._id, programme.name)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {programmes.length === 0 && (
        <Card className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-2">No programmes found</h3>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            Get started by creating your first skilling programme and begin tracking beneficiaries
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="lg"
            className="mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Programme
          </Button>
        </Card>
      )}

      {/* Create Programme Modal */}
      {showCreateModal && (
        <CreateProgrammeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries('programmes')
          }}
        />
      )}
    </div>
  )
}

// Create Programme Modal Component
const CreateProgrammeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    sponsor_type: 'CSR',
    name: '',
    code: '',
    description: '',
    start_date: '',
    end_date: '',
    sectors: [],
    districts: []
  })
  const [sectorInput, setSectorInput] = useState('')
  const [districtInput, setDistrictInput] = useState('')

  const createProgramme = useMutation(async (data) => {
    const response = await fetch('/api/programmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        created_by: 'current-user-id' // In real app, get from auth context
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create programme')
    }
    return response.json()
  }, {
    onSuccess: () => {
      toast.success('Programme created successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createProgramme.mutate(formData)
  }

  const addSector = () => {
    if (sectorInput.trim() && !formData.sectors.includes(sectorInput.trim())) {
      setFormData({ ...formData, sectors: [...formData.sectors, sectorInput.trim()] })
      setSectorInput('')
    }
  }

  const removeSector = (sector) => {
    setFormData({ ...formData, sectors: formData.sectors.filter(s => s !== sector) })
  }

  const addDistrict = () => {
    if (districtInput.trim() && !formData.districts.includes(districtInput.trim())) {
      setFormData({ ...formData, districts: [...formData.districts, districtInput.trim()] })
      setDistrictInput('')
    }
  }

  const removeDistrict = (district) => {
    setFormData({ ...formData, districts: formData.districts.filter(d => d !== district) })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Programme"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Sponsor Type</label>
            <select
              value={formData.sponsor_type}
              onChange={(e) => setFormData({ ...formData, sponsor_type: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="CSR">CSR</option>
              <option value="GOV">Government</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Programme Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., EVTN25"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Programme Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., EV Technicians Pune-Nashik 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description of the programme"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Sectors</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add sector"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
            />
            <Button type="button" onClick={addSector} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sectors.map((sector, index) => (
              <Badge key={index} variant="primary" className="flex items-center">
                {sector}
                <button
                  type="button"
                  onClick={() => removeSector(sector)}
                  className="ml-2 text-primary-500 hover:text-primary-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Districts</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add district (e.g., MH-Pune)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDistrict())}
            />
            <Button type="button" onClick={addDistrict} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.districts.map((district, index) => (
              <Badge key={index} variant="success" className="flex items-center">
                {district}
                <button
                  type="button"
                  onClick={() => removeDistrict(district)}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={createProgramme.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createProgramme.isLoading}
            disabled={createProgramme.isLoading}
          >
            {createProgramme.isLoading ? 'Creating...' : 'Create Programme'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default Programmes

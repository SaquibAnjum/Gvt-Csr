import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Users, 
  Target, 
  DollarSign,
  Calendar,
  MapPin,
  Building2,
  Award,
  Briefcase,
  TrendingUp,
  Download,
  Upload,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const ProgrammeDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const queryClient = useQueryClient()

  // Fetch programme details
  const { data: programmeData, isLoading } = useQuery(
    ['programme', id],
    async () => {
      const response = await fetch(`/api/programmes/${id}`)
      if (!response.ok) throw new Error('Failed to fetch programme')
      return response.json()
    }
  )

  // Fetch dashboard data
  const { data: dashboardData } = useQuery(
    ['dashboard', id],
    async () => {
      const response = await fetch(`/api/impact/dashboard/${id}?window=30d`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      return response.json()
    }
  )

  // Fetch beneficiaries
  const { data: beneficiariesData } = useQuery(
    ['beneficiaries', id],
    async () => {
      const response = await fetch(`/api/beneficiaries/programme/${id}`)
      if (!response.ok) throw new Error('Failed to fetch beneficiaries')
      return response.json()
    }
  )

  const programme = programmeData?.data
  const dashboard = dashboardData?.data
  const beneficiaries = beneficiariesData?.data || []

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'beneficiaries', name: 'Beneficiaries', icon: Users },
    { id: 'targets', name: 'Targets & Progress', icon: Target },
    { id: 'financial', name: 'Financial Tracking', icon: DollarSign },
    { id: 'evidence', name: 'Evidence & Reports', icon: FileText }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!programme) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-secondary-900 mb-2">Programme not found</h3>
        <Link to="/programmes" className="btn btn-primary">
          Back to Programmes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/programmes" className="p-2 hover:bg-secondary-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-secondary-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{programme.name}</h1>
            <p className="text-secondary-600">{programme.code} • {programme.sponsor_type}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-secondary flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Programme
          </button>
          <button className="btn btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Beneficiaries
          </button>
        </div>
      </div>

      {/* Programme Info Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Programme Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-secondary-500" />
                <span>{new Date(programme.start_date).toLocaleDateString()} - {new Date(programme.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-secondary-500" />
                <span>{programme.districts.length} districts</span>
              </div>
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-secondary-500" />
                <span className="capitalize">{programme.sponsor_type}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Sectors</h3>
            <div className="flex flex-wrap gap-1">
              {programme.sectors.map((sector, index) => (
                <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {sector}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Districts</h3>
            <div className="flex flex-wrap gap-1">
              {programme.districts.map((district, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {district}
                </span>
              ))}
            </div>
          </div>
        </div>
        {programme.description && (
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">Description</h3>
            <p className="text-secondary-600">{programme.description}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab programme={programme} dashboard={dashboard} />}
        {activeTab === 'beneficiaries' && <BeneficiariesTab beneficiaries={beneficiaries} programmeId={id} />}
        {activeTab === 'targets' && <TargetsTab programmeId={id} programme={programme} />}
        {activeTab === 'financial' && <FinancialTab programmeId={id} programme={programme} />}
        {activeTab === 'evidence' && <EvidenceTab programmeId={id} programme={programme} />}
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ programme, dashboard }) => {
  if (!dashboard) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    )
  }

  const kpiCards = [
    {
      title: 'Trained',
      value: dashboard.kpis.trained.value,
      target: dashboard.kpis.trained.target,
      percentage: dashboard.kpis.trained.percentage,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Certified',
      value: dashboard.kpis.certified.value,
      target: dashboard.kpis.certified.target,
      percentage: dashboard.kpis.certified.percentage,
      icon: Award,
      color: 'green'
    },
    {
      title: 'Placed',
      value: dashboard.kpis.placed.value,
      target: dashboard.kpis.placed.target,
      percentage: dashboard.kpis.placed.percentage,
      icon: Briefcase,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{card.title}</p>
                  <p className="text-2xl font-bold text-secondary-900">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-secondary-500">Target: {card.target}</p>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Progress</span>
                  <span className="font-medium">{card.percentage}%</span>
                </div>
                <div className="mt-2 w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`bg-${card.color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(card.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-secondary-900 mb-4">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">SkillScore Uplift</span>
              <span className="font-medium">{dashboard.kpis.skillscore_uplift.median}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Median CTC</span>
              <span className="font-medium">₹{(dashboard.kpis.median_ctc.value / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Certification Rate</span>
              <span className="font-medium">
                {Math.round((dashboard.kpis.certified.value / dashboard.kpis.trained.value) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-secondary-900 mb-4">District Performance</h3>
          <div className="space-y-2">
            {dashboard.breakdown.by_district.map((district, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-secondary-600">{district.code}</span>
                <div className="flex space-x-4">
                  <span className="text-green-600">{district.certified} certified</span>
                  <span className="text-purple-600">{district.placed} placed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Beneficiaries Tab Component
const BeneficiariesTab = ({ beneficiaries, programmeId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showProfile, setShowProfile] = useState(null)

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.learner_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || beneficiary.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Learner ID or Beneficiary ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Users className="h-4 w-4 text-secondary-400" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="TRAINING">Training</option>
              <option value="CERTIFIED">Certified</option>
              <option value="PLACED">Placed</option>
              <option value="DROPPED">Dropped</option>
            </select>
            <Button variant="secondary" className="flex items-center space-x-1">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Beneficiary</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Beneficiaries Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">
            Beneficiaries ({filteredBeneficiaries.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Beneficiary ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Learner ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">SkillScore</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Placement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary._id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {beneficiary._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {beneficiary.learner_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      beneficiary.status === 'ENROLLED' ? 'warning' :
                      beneficiary.status === 'TRAINING' ? 'info' :
                      beneficiary.status === 'CERTIFIED' ? 'success' :
                      beneficiary.status === 'PLACED' ? 'primary' : 'danger'
                    }>
                      {beneficiary.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {new Date(beneficiary.enrolled_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-secondary-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${beneficiary.progress_record?.[0]?.training_pct || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-secondary-600">
                        {beneficiary.progress_record?.[0]?.training_pct || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {beneficiary.progress_record?.[0]?.last_skillscore ? 
                      `${beneficiary.progress_record[0].last_skillscore}%` : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {beneficiary.placement_record?.[0] ? (
                      <div className="flex items-center text-green-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span className="text-sm">Placed</span>
                      </div>
                    ) : (
                      <span className="text-secondary-500 text-sm">Not Placed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowProfile(beneficiary)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBeneficiaries.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No beneficiaries found</h3>
            <p className="text-secondary-600 mb-4">
              {searchTerm || statusFilter ? 'Try adjusting your search or filter criteria' : 'Add beneficiaries to get started'}
            </p>
            <Button className="flex items-center space-x-2 mx-auto">
              <Plus className="h-4 w-4" />
              <span>Add Beneficiaries</span>
            </Button>
          </div>
        )}
      </Card>

      {/* Individual Profile Modal */}
      {showProfile && (
        <IndividualProfileModal
          beneficiary={showProfile}
          onClose={() => setShowProfile(null)}
        />
      )}
    </div>
  )
}

// Individual Profile Modal Component
const IndividualProfileModal = ({ beneficiary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Beneficiary Profile</h2>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-secondary-900">Personal Information</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Beneficiary ID</label>
                    <p className="text-secondary-900">{beneficiary._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Learner ID</label>
                    <p className="text-secondary-900">{beneficiary.learner_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Status</label>
                    <Badge variant={
                      beneficiary.status === 'ENROLLED' ? 'warning' :
                      beneficiary.status === 'TRAINING' ? 'info' :
                      beneficiary.status === 'CERTIFIED' ? 'success' :
                      beneficiary.status === 'PLACED' ? 'primary' : 'danger'
                    }>
                      {beneficiary.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Enrolled Date</label>
                    <p className="text-secondary-900">{new Date(beneficiary.enrolled_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Training Progress */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-secondary-900">Training Progress</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary-600">Training Completion</span>
                      <span className="font-medium">{beneficiary.progress_record?.[0]?.training_pct || 0}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-3">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${beneficiary.progress_record?.[0]?.training_pct || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Last SkillScore</label>
                    <p className="text-secondary-900">
                      {beneficiary.progress_record?.[0]?.last_skillscore ? 
                        `${beneficiary.progress_record[0].last_skillscore}%` : 
                        'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Placement Status</label>
                    <p className="text-secondary-900">
                      {beneficiary.placement_record?.[0] ? 'Placed' : 'Not Placed'}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Document Uploads */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-secondary-900">Documents</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-secondary-500" />
                      <span className="text-sm text-secondary-700">Aadhaar Card</span>
                    </div>
                    <Button variant="secondary" size="sm">Upload</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-secondary-500" />
                      <span className="text-sm text-secondary-700">Bank Details</span>
                    </div>
                    <Button variant="secondary" size="sm">Upload</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-secondary-500" />
                      <span className="text-sm text-secondary-700">Offer Letter</span>
                    </div>
                    <Button variant="secondary" size="sm">Upload</Button>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Training History */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-secondary-900">Training History</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {beneficiary.progress_record?.map((record, index) => (
                    <div key={index} className="p-3 bg-secondary-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-secondary-900">Training Session {index + 1}</p>
                          <p className="text-xs text-secondary-600">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-secondary-900">{record.training_pct}%</p>
                          <p className="text-xs text-secondary-600">Completion</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Targets Tab Component
const TargetsTab = ({ programmeId, programme }) => {
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock targets data
  const targets = [
    { id: 1, name: 'Training Completion', target: 1000, achieved: 812, percentage: 81.2, deadline: '2025-03-31' },
    { id: 2, name: 'Certification', target: 800, achieved: 620, percentage: 77.5, deadline: '2025-04-15' },
    { id: 3, name: 'Placement', target: 600, achieved: 455, percentage: 75.8, deadline: '2025-05-31' }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Programme Targets & Progress</h3>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Target
          </Button>
        </div>
        
        <div className="space-y-4">
          {targets.map((target) => (
            <div key={target.id} className="p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-secondary-900">{target.name}</h4>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">{target.percentage}%</span>
                  <p className="text-sm text-secondary-600">{target.achieved} / {target.target}</p>
                </div>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(target.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-secondary-600">
                <span>Deadline: {new Date(target.deadline).toLocaleDateString()}</span>
                <span>{target.target - target.achieved} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Chart */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Progress Over Time</h3>
        </Card.Header>
        <Card.Content>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Jan', trained: 200, certified: 150, placed: 100 },
              { month: 'Feb', trained: 400, certified: 300, placed: 200 },
              { month: 'Mar', trained: 600, certified: 450, placed: 300 },
              { month: 'Apr', trained: 750, certified: 550, placed: 400 },
              { month: 'May', trained: 812, certified: 620, placed: 455 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="trained" stroke="#3B82F6" strokeWidth={2} name="Trained" />
              <Line type="monotone" dataKey="certified" stroke="#10B981" strokeWidth={2} name="Certified" />
              <Line type="monotone" dataKey="placed" stroke="#8B5CF6" strokeWidth={2} name="Placed" />
            </LineChart>
          </ResponsiveContainer>
        </Card.Content>
      </Card>
    </div>
  )
}

// Financial Tracking Tab Component
const FinancialTab = ({ programmeId, programme }) => {
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock financial data
  const financialData = {
    totalBudget: 2400000,
    disbursed: 1800000,
    pending: 600000,
    avgCostPerBeneficiary: 12500,
    disbursements: [
      { id: 1, date: '2025-01-15', amount: 500000, type: 'Training Infrastructure', status: 'Completed' },
      { id: 2, date: '2025-02-01', amount: 300000, type: 'Instructor Fees', status: 'Completed' },
      { id: 3, date: '2025-02-15', amount: 400000, type: 'Equipment & Materials', status: 'Completed' },
      { id: 4, date: '2025-03-01', amount: 300000, type: 'Certification Costs', status: 'Completed' },
      { id: 5, date: '2025-03-15', amount: 300000, type: 'Placement Support', status: 'Completed' },
      { id: 6, date: '2025-04-01', amount: 600000, type: 'Final Disbursement', status: 'Pending' }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{(financialData.totalBudget / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-green-700">Total Budget</div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹{(financialData.disbursed / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-blue-700">Disbursed</div>
              <div className="text-xs text-blue-600 mt-1">{Math.round((financialData.disbursed / financialData.totalBudget) * 100)}% of budget</div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">₹{(financialData.pending / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-orange-700">Pending</div>
              <div className="text-xs text-orange-600 mt-1">{Math.round((financialData.pending / financialData.totalBudget) * 100)}% remaining</div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹{(financialData.avgCostPerBeneficiary / 1000).toFixed(1)}K</div>
              <div className="text-sm text-purple-700">Avg. Cost/Beneficiary</div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Disbursement History */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Disbursement History</h3>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Disbursement
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {financialData.disbursements.map((disbursement) => (
                  <tr key={disbursement.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {new Date(disbursement.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                      {disbursement.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      ₹{(disbursement.amount / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={disbursement.status === 'Completed' ? 'success' : 'warning'}>
                        {disbursement.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="secondary" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Financial Chart */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Budget Utilization</h3>
        </Card.Header>
        <Card.Content>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { category: 'Training Infrastructure', budget: 500000, used: 500000 },
              { category: 'Instructor Fees', budget: 300000, used: 300000 },
              { category: 'Equipment & Materials', budget: 400000, used: 400000 },
              { category: 'Certification Costs', budget: 300000, used: 300000 },
              { category: 'Placement Support', budget: 300000, used: 300000 },
              { category: 'Final Disbursement', budget: 600000, used: 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${(value/1000).toFixed(0)}K`, name === 'budget' ? 'Budget' : 'Used']} />
              <Bar dataKey="budget" fill="#E5E7EB" name="budget" />
              <Bar dataKey="used" fill="#3B82F6" name="used" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Content>
      </Card>
    </div>
  )
}

// Evidence Tab Component
const EvidenceTab = ({ programmeId, programme }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock evidence data
  const evidenceBundles = [
    { id: 1, name: 'Full Evidence Bundle', type: 'FULL', created: '2025-01-15', status: 'READY', items: 25, downloads: 3 },
    { id: 2, name: 'Attendance Records', type: 'ATTENDANCE', created: '2025-01-20', status: 'READY', items: 12, downloads: 1 },
    { id: 3, name: 'Proctoring Logs', type: 'PROCTOR', created: '2025-01-25', status: 'GENERATING', items: 0, downloads: 0 }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Evidence Bundles</h3>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bundle
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceBundles.map((bundle) => (
            <div key={bundle.id} className="p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-secondary-900">{bundle.name}</h4>
                  <p className="text-sm text-secondary-600">{bundle.type} Bundle</p>
                </div>
                <Badge variant={
                  bundle.status === 'READY' ? 'success' :
                  bundle.status === 'GENERATING' ? 'warning' : 'danger'
                }>
                  {bundle.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-secondary-600 mb-4">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(bundle.created).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{bundle.items}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span>{bundle.downloads}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={bundle.status !== 'READY'}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="secondary" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-secondary-900">Compliance Checklist</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[
              { item: 'Beneficiary Registration Documents', required: true, completed: true },
              { item: 'Training Attendance Records', required: true, completed: true },
              { item: 'Assessment & Certification Records', required: true, completed: true },
              { item: 'Placement Verification Documents', required: true, completed: false },
              { item: 'Financial Disbursement Records', required: true, completed: true },
              { item: 'Programme Progress Reports', required: false, completed: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    item.completed ? 'bg-green-500 border-green-500' : 'border-secondary-300'
                  }`}>
                    {item.completed && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-900">{item.item}</span>
                    {item.required && (
                      <span className="ml-2 text-xs text-red-600">Required</span>
                    )}
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  {item.completed ? 'View' : 'Upload'}
                </Button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ProgrammeDetail

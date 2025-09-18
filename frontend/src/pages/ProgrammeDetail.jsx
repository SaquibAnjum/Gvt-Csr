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
  Briefcase
} from 'lucide-react'
import { Link } from 'react-router-dom'
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
    { id: 'targets', name: 'Targets', icon: Target },
    { id: 'funding', name: 'Funding Rules', icon: DollarSign }
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
        {activeTab === 'beneficiaries' && <BeneficiariesTab beneficiaries={beneficiaries} />}
        {activeTab === 'targets' && <TargetsTab programmeId={id} />}
        {activeTab === 'funding' && <FundingTab programmeId={id} />}
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
const BeneficiariesTab = ({ beneficiaries }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Beneficiaries ({beneficiaries.length})</h3>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Beneficiaries
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Learner ID</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.slice(0, 10).map((beneficiary) => (
              <tr key={beneficiary._id}>
                <td className="font-medium">{beneficiary._id.slice(-8)}</td>
                <td>{beneficiary.learner_id}</td>
                <td>
                  <span className={`status-badge ${
                    beneficiary.status === 'ENROLLED' ? 'status-enrolled' :
                    beneficiary.status === 'TRAINING' ? 'status-training' :
                    beneficiary.status === 'CERTIFIED' ? 'status-certified' :
                    beneficiary.status === 'PLACED' ? 'status-placed' : 'status-dropped'
                  }`}>
                    {beneficiary.status}
                  </span>
                </td>
                <td>{new Date(beneficiary.enrolled_at).toLocaleDateString()}</td>
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
                  <button className="p-1 hover:bg-secondary-100 rounded">
                    <Eye className="h-4 w-4 text-secondary-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {beneficiaries.length > 10 && (
        <div className="mt-4 text-center">
          <Link to={`/beneficiaries?programme=${beneficiaries[0]?.programme_id}`} className="btn btn-secondary">
            View All Beneficiaries
          </Link>
        </div>
      )}
    </div>
  )
}

// Targets Tab Component
const TargetsTab = ({ programmeId }) => {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Programme Targets</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Target
        </button>
      </div>
      
      <div className="text-center py-8 text-secondary-500">
        <Target className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
        <p>No targets set for this programme</p>
        <p className="text-sm">Add targets to track programme performance</p>
      </div>
    </div>
  )
}

// Funding Tab Component
const FundingTab = ({ programmeId }) => {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Funding Rules</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </button>
      </div>
      
      <div className="text-center py-8 text-secondary-500">
        <DollarSign className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
        <p>No funding rules set for this programme</p>
        <p className="text-sm">Add funding rules to track programme costs</p>
      </div>
    </div>
  )
}

export default ProgrammeDetail

import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Users, 
  Award, 
  Briefcase, 
  TrendingUp, 
  MapPin,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Bell,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Dashboard = () => {
  const [selectedProgramme, setSelectedProgramme] = useState('all')
  const [showAlerts, setShowAlerts] = useState(false)

  // Fetch programmes for filter
  const { data: programmesData } = useQuery('programmes', async () => {
    const response = await fetch('/api/programmes')
    if (!response.ok) throw new Error('Failed to fetch programmes')
    return response.json()
  })

  // Mock data - in real app, this would come from API
  const { data: dashboardData, isLoading } = useQuery(['dashboard', selectedProgramme], async () => {
    const response = await fetch(`/api/impact/dashboard/${selectedProgramme}?window=30d`)
    if (!response.ok) throw new Error('Failed to fetch dashboard data')
    return response.json()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" text="Loading dashboard data..." />
      </div>
    )
  }

  const programmes = programmesData?.data || []
  const data = dashboardData?.data || {
    kpis: {
      trained: { value: 812, target: 1000, percentage: 81 },
      certified: { value: 620, target: 800, percentage: 78 },
      placed: { value: 455, target: 600, percentage: 76 },
      skillscore_uplift: { median: 21.4 },
      median_ctc: { value: 276000 }
    },
    breakdown: {
      by_district: [
        { code: 'MH-Pune', name: 'Pune', certified: 430, placed: 320, trained: 500, total_target: 600, performance_score: 85 },
        { code: 'MH-Nashik', name: 'Nashik', certified: 190, placed: 135, trained: 250, total_target: 300, performance_score: 78 },
        { code: 'MH-Mumbai', name: 'Mumbai', certified: 320, placed: 280, trained: 400, total_target: 500, performance_score: 92 },
        { code: 'MH-Nagpur', name: 'Nagpur', certified: 150, placed: 120, trained: 200, total_target: 250, performance_score: 72 },
        { code: 'MH-Aurangabad', name: 'Aurangabad', certified: 180, placed: 140, trained: 220, total_target: 280, performance_score: 75 }
      ]
    },
    alerts: [
      { id: 1, type: 'warning', message: 'Pune programme is 15% behind target', programme: 'EV Technicians Pune-Nashik 2025', severity: 'high' },
      { id: 2, type: 'info', message: 'Nashik programme completed 80% of training', programme: 'EV Technicians Pune-Nashik 2025', severity: 'medium' },
      { id: 3, type: 'success', message: 'Mumbai programme exceeded placement targets', programme: 'EV Technicians Pune-Nashik 2025', severity: 'low' }
    ]
  }

  const kpiCards = [
    {
      title: 'Trained',
      value: data.kpis.trained.value,
      target: data.kpis.trained.target,
      percentage: data.kpis.trained.percentage,
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Certified',
      value: data.kpis.certified.value,
      target: data.kpis.certified.target,
      percentage: data.kpis.certified.percentage,
      icon: Award,
      color: 'green',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Placed',
      value: data.kpis.placed.value,
      target: data.kpis.placed.target,
      percentage: data.kpis.placed.percentage,
      icon: Briefcase,
      color: 'purple',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Median CTC',
      value: `₹${(data.kpis.median_ctc.value / 1000).toFixed(0)}K`,
      target: '₹300K',
      percentage: Math.round((data.kpis.median_ctc.value / 300000) * 100),
      icon: TrendingUp,
      color: 'orange',
      trend: '+5%',
      trendUp: true
    }
  ]

  const districtData = data.breakdown.by_district.map(district => ({
    name: district.name,
    certified: district.certified,
    placed: district.placed,
    trained: district.trained,
    performance_score: district.performance_score,
    total_target: district.total_target
  }))

  const statusData = [
    { name: 'Enrolled', value: 1000, color: '#3B82F6', percentage: 100 },
    { name: 'Training', value: 812, color: '#F59E0B', percentage: 81.2 },
    { name: 'Certified', value: 620, color: '#10B981', percentage: 62.0 },
    { name: 'Placed', value: 455, color: '#8B5CF6', percentage: 45.5 }
  ]

  const totalValue = statusData.reduce((sum, item) => sum + item.value, 0)
  const statusDataWithPercentages = statusData.map(item => ({
    ...item,
    percentage: ((item.value / totalValue) * 100).toFixed(1)
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-secondary-600 mt-2">Comprehensive overview of your skilling programmes</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Program Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-secondary-500" />
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="all">All Programmes</option>
              {programmes.map((programme) => (
                <option key={programme._id} value={programme._id}>
                  {programme.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Alerts */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {data.alerts?.filter(alert => alert.severity === 'high').length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {data.alerts.filter(alert => alert.severity === 'high').length}
                  </span>
                </span>
              )}
            </button>
            
            {/* Alerts Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="font-semibold text-secondary-900">Alerts & Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {data.alerts?.map((alert) => (
                    <div key={alert.id} className="p-3 border-b border-secondary-100 hover:bg-secondary-50">
                      <div className="flex items-start space-x-2">
                        <div className={`p-1 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-100' : 
                          alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {alert.severity === 'high' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : alert.severity === 'medium' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-900">{alert.message}</p>
                          <p className="text-xs text-secondary-500 mt-1">{alert.programme}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-secondary-200">
                  <Button variant="secondary" size="sm" className="w-full">
                    View All Alerts
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Badge variant="success" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Live Data</span>
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-secondary-500">
            <Building2 className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} hover gradient className="group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-secondary-600">{card.title}</p>
                    <div className="flex items-center space-x-1">
                      {card.trendUp ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {card.trend}
                      </span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-secondary-900 mb-1">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-secondary-500">Target: {card.target}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${card.color}-100 to-${card.color}-200 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-secondary-600">Progress</span>
                  <span className="font-semibold text-secondary-900">{card.percentage}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(card.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Performance */}
        <Card hover>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Performance by District</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="info">Monthly</Badge>
                <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            {/* Heat Map Legend */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-secondary-600">High Performance (80%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-secondary-600">Medium (60-80%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-secondary-600">Low (&lt;60%)</span>
                </div>
              </div>
            </div>

            {/* District Heat Map */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {districtData.map((district, index) => {
                const performanceColor = district.performance_score >= 80 ? 'bg-green-500' : 
                                       district.performance_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                return (
                  <div key={index} className="text-center">
                    <div className={`${performanceColor} rounded-lg p-3 mb-2 text-white font-semibold`}>
                      {district.performance_score}%
                    </div>
                    <div className="text-xs text-secondary-600">{district.name}</div>
                    <div className="text-xs text-secondary-500">
                      {district.certified}/{district.total_target}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [
                    `${value} people`,
                    name === 'trained' ? 'Trained' : name === 'certified' ? 'Certified' : 'Placed'
                  ]}
                />
                <Bar 
                  dataKey="trained" 
                  fill="url(#trainedGradient)" 
                  name="trained"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="certified" 
                  fill="url(#certifiedGradient)" 
                  name="certified"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="placed" 
                  fill="url(#placedGradient)" 
                  name="placed"
                  radius={[2, 2, 0, 0]}
                />
                <defs>
                  <linearGradient id="trainedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="certifiedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="placedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        {/* Status Distribution */}
        <Card hover>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Status Distribution</h3>
              <Badge variant="purple">Live</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDataWithPercentages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDataWithPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name, props) => [
                    `${value} people (${props.payload.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Interactive Legend with Percentages */}
            <div className="mt-6 space-y-3">
              {statusDataWithPercentages.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-secondary-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-secondary-900">{item.value.toLocaleString()}</div>
                    <div className="text-sm text-secondary-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Stats */}
            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{totalValue.toLocaleString()}</div>
                  <div className="text-sm text-primary-700">Total Beneficiaries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {((statusDataWithPercentages.find(s => s.name === 'Placed')?.value || 0) / totalValue * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-primary-700">Placement Rate</div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Financial Tracking Section */}
      <Card hover>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Financial Overview</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="info">Current Month</Badge>
              <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>View Details</span>
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹2.4M</div>
              <div className="text-sm text-green-700">Total Budget</div>
              <div className="text-xs text-green-600 mt-1">+5% from last month</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹1.8M</div>
              <div className="text-sm text-blue-700">Disbursed</div>
              <div className="text-xs text-blue-600 mt-1">75% of budget</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">₹0.6M</div>
              <div className="text-sm text-orange-700">Pending</div>
              <div className="text-xs text-orange-600 mt-1">25% remaining</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹12.5K</div>
              <div className="text-sm text-purple-700">Avg. Cost/Beneficiary</div>
              <div className="text-xs text-purple-600 mt-1">Below target</div>
            </div>
          </div>
          
          {/* Financial Progress Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-secondary-700 mb-3">Budget Utilization by Programme</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'EV Tech Pune', budget: 800000, used: 650000, percentage: 81 },
                { name: 'EV Tech Nashik', budget: 600000, used: 420000, percentage: 70 },
                { name: 'EV Tech Mumbai', budget: 1000000, used: 750000, percentage: 75 }
              ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => [`₹${(value/1000000).toFixed(1)}M`, name === 'budget' ? 'Budget' : 'Used']} />
                <Bar dataKey="budget" fill="#E5E7EB" name="budget" />
                <Bar dataKey="used" fill="url(#financialGradient)" name="used" />
                <defs>
                  <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="group">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">SkillScore Uplift</p>
              <p className="text-2xl font-bold text-secondary-900">{data.kpis.skillscore_uplift.median}%</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.3% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="group">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Districts</p>
              <p className="text-2xl font-bold text-secondary-900">{data.breakdown.by_district.length}</p>
              <p className="text-xs text-blue-600 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Across Maharashtra
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="group">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Certification Rate</p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round((data.kpis.certified.value / data.kpis.trained.value) * 100)}%
              </p>
              <p className="text-xs text-purple-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Above target
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

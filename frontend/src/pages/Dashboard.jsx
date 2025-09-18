import React from 'react'
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
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const { data: dashboardData, isLoading } = useQuery('dashboard', async () => {
    const response = await fetch('/api/impact/dashboard/programme-1?window=30d')
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
        { code: 'MH-Pune', certified: 430, placed: 320 },
        { code: 'MH-Nashik', certified: 190, placed: 135 }
      ]
    }
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
    name: district.code.split('-')[1], // Extract district name
    certified: district.certified,
    placed: district.placed
  }))

  const statusData = [
    { name: 'Enrolled', value: 1000, color: '#3B82F6' },
    { name: 'Training', value: 812, color: '#F59E0B' },
    { name: 'Certified', value: 620, color: '#10B981' },
    { name: 'Placed', value: 455, color: '#8B5CF6' }
  ]

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
              <Badge variant="info">Monthly</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                />
                <Bar 
                  dataKey="certified" 
                  fill="url(#certifiedGradient)" 
                  name="Certified"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="placed" 
                  fill="url(#placedGradient)" 
                  name="Placed"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="certifiedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="placedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </BarChart>
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
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-secondary-600">{item.name}</span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

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

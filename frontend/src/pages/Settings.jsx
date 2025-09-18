import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Database, 
  Bell,
  Key,
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'data', name: 'Data & Privacy', icon: Database },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'system', name: 'System', icon: Globe }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab showPassword={showPassword} setShowPassword={setShowPassword} />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'data' && <DataPrivacyTab />}
          {activeTab === 'api' && <ApiKeysTab />}
          {activeTab === 'system' && <SystemTab />}
        </div>
      </div>
    </div>
  )
}

// Profile Tab Component
const ProfileTab = () => {
  const [formData, setFormData] = useState({
    name: 'Programme Manager',
    email: 'pm@govcsr.gov.in',
    phone: '+91 98765 43210',
    organization: 'Government CSR Portal',
    role: 'Programme Manager',
    department: 'Skill Development'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Profile updated successfully')
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Profile Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Organization</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

// Security Tab Component
const SecurityTab = ({ showPassword, setShowPassword }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password updated successfully')
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Change Password</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-secondary-500" /> : <Eye className="h-4 w-4 text-secondary-500" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-secondary-500" /> : <Eye className="h-4 w-4 text-secondary-500" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-secondary-500" /> : <Eye className="h-4 w-4 text-secondary-500" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-900">2FA Status</p>
            <p className="text-sm text-secondary-600">Add an extra layer of security to your account</p>
          </div>
          <button className="btn btn-secondary">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  )
}

// Notifications Tab Component
const NotificationsTab = () => {
  const [notifications, setNotifications] = useState({
    email: {
      programmeUpdates: true,
      beneficiaryUpdates: true,
      exportComplete: true,
      systemAlerts: false
    },
    push: {
      programmeUpdates: false,
      beneficiaryUpdates: true,
      exportComplete: true,
      systemAlerts: true
    }
  })

  const handleToggle = (type, key) => {
    setNotifications({
      ...notifications,
      [type]: {
        ...notifications[type],
        [key]: !notifications[type][key]
      }
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Notification Preferences</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-secondary-900 mb-4">Email Notifications</h4>
          <div className="space-y-3">
            {Object.entries(notifications.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-secondary-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle('email', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-secondary-900 mb-4">Push Notifications</h4>
          <div className="space-y-3">
            {Object.entries(notifications.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-secondary-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle('push', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="btn btn-primary">
          Save Preferences
        </button>
      </div>
    </div>
  )
}

// Data Privacy Tab Component
const DataPrivacyTab = () => {
  const [consent, setConsent] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
    auditLogs: true
  })

  const handleConsentChange = (key) => {
    setConsent({ ...consent, [key]: !consent[key] })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Data Sharing Consent</h3>
        
        <div className="space-y-4">
          {Object.entries(consent).map(([key, value]) => (
            <div key={key} className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-secondary-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h4>
                <p className="text-sm text-secondary-600 mt-1">
                  {key === 'dataSharing' && 'Allow sharing of anonymized data for research and policy making'}
                  {key === 'analytics' && 'Help improve the platform by sharing usage analytics'}
                  {key === 'marketing' && 'Receive updates about new features and programmes'}
                  {key === 'auditLogs' && 'Maintain audit logs for compliance and security'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleConsentChange(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Data Retention</h3>
        
        <div className="space-y-4">
          <div>
            <label className="label">Audit Logs Retention</label>
            <select className="input">
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
              <option value="5y">5 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
          <div>
            <label className="label">Evidence Bundles Retention</label>
            <select className="input">
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// API Keys Tab Component
const ApiKeysTab = () => {
  const [apiKeys] = useState([
    { id: 1, name: 'Production API', key: 'sk-...abcd1234', created: '2024-01-15', lastUsed: '2024-01-20' },
    { id: 2, name: 'Development API', key: 'sk-...efgh5678', created: '2024-01-10', lastUsed: '2024-01-19' }
  ])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">API Keys</h3>
        <button className="btn btn-primary">
          Generate New Key
        </button>
      </div>
      
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div key={key.id} className="border border-secondary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">{key.name}</h4>
                <p className="text-sm text-secondary-600">{key.key}</p>
                <p className="text-xs text-secondary-500 mt-1">
                  Created: {key.created} • Last used: {key.lastUsed}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="btn btn-secondary text-sm">
                  Regenerate
                </button>
                <button className="btn btn-danger text-sm">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// System Tab Component
const SystemTab = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">System Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Version</label>
            <p className="text-sm text-secondary-600">v1.0.0</p>
          </div>
          <div>
            <label className="label">Last Updated</label>
            <p className="text-sm text-secondary-600">January 20, 2024</p>
          </div>
          <div>
            <label className="label">Database Status</label>
            <p className="text-sm text-green-600">Connected</p>
          </div>
          <div>
            <label className="label">Storage Used</label>
            <p className="text-sm text-secondary-600">2.4 GB / 10 GB</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Maintenance</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Clear Cache</h4>
              <p className="text-sm text-secondary-600">Clear application cache to free up memory</p>
            </div>
            <button className="btn btn-secondary">
              Clear Cache
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Export Data</h4>
              <p className="text-sm text-secondary-600">Download all your data for backup</p>
            </div>
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

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
  EyeOff,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'users', name: 'User Management', icon: Users },
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
          {activeTab === 'users' && <UserManagementTab />}
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

// User Management Tab Component
const UserManagementTab = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@govcsr.gov.in',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2025-01-25',
      permissions: ['read', 'write', 'delete', 'manage_users']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@govcsr.gov.in',
      role: 'Programme Manager',
      status: 'Active',
      lastLogin: '2025-01-24',
      permissions: ['read', 'write']
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@govcsr.gov.in',
      role: 'Viewer',
      status: 'Inactive',
      lastLogin: '2025-01-20',
      permissions: ['read']
    }
  ])

  const roles = [
    { value: 'Admin', label: 'Administrator', permissions: ['read', 'write', 'delete', 'manage_users'] },
    { value: 'Programme Manager', label: 'Programme Manager', permissions: ['read', 'write'] },
    { value: 'Editor', label: 'Editor', permissions: ['read', 'write'] },
    { value: 'Viewer', label: 'Viewer', permissions: ['read'] }
  ]

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    }
  }

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
    toast.success('User status updated')
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">User Management</h3>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                      <div className="text-sm text-secondary-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary">{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          roles={roles}
          onClose={() => setShowAddModal(false)}
          onSuccess={(newUser) => {
            setUsers([...users, { ...newUser, id: users.length + 1 }])
            setShowAddModal(false)
            toast.success('User added successfully')
          }}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          roles={roles}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onSuccess={(updatedUser) => {
            setUsers(users.map(user => 
              user.id === updatedUser.id ? updatedUser : user
            ))
            setShowEditModal(false)
            setSelectedUser(null)
            toast.success('User updated successfully')
          }}
        />
      )}
    </div>
  )
}

// Add User Modal Component
const AddUserModal = ({ roles, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    permissions: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSuccess({
      ...formData,
      status: 'Active',
      lastLogin: new Date().toISOString().split('T')[0]
    })
  }

  const handleRoleChange = (roleValue) => {
    const role = roles.find(r => r.value === roleValue)
    setFormData({
      ...formData,
      role: roleValue,
      permissions: role ? role.permissions : []
    })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Add New User"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {formData.role && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Permissions</label>
            <div className="space-y-2">
              {roles.find(r => r.value === formData.role)?.permissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-secondary-700 capitalize">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Edit User Modal Component
const EditUserModal = ({ user, roles, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSuccess({
      ...user,
      ...formData
    })
  }

  const handleRoleChange = (roleValue) => {
    const role = roles.find(r => r.value === roleValue)
    setFormData({
      ...formData,
      role: roleValue,
      permissions: role ? role.permissions : []
    })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit User"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Permissions</label>
          <div className="space-y-2">
            {formData.permissions.map((permission) => (
              <div key={permission} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-secondary-700 capitalize">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Update User
          </Button>
        </div>
      </form>
    </Modal>
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
  const [apiKeys, setApiKeys] = useState([
    { 
      id: 1, 
      name: 'Production API', 
      key: 'sk-...abcd1234', 
      fullKey: 'sk-prod-1234567890abcdef1234567890abcdef12345678',
      created: '2024-01-15', 
      lastUsed: '2024-01-20',
      permissions: ['read', 'write'],
      status: 'Active',
      usage: { requests: 1250, limit: 10000 }
    },
    { 
      id: 2, 
      name: 'Development API', 
      key: 'sk-...efgh5678', 
      fullKey: 'sk-dev-1234567890abcdef1234567890abcdef12345678',
      created: '2024-01-10', 
      lastUsed: '2024-01-19',
      permissions: ['read'],
      status: 'Active',
      usage: { requests: 450, limit: 5000 }
    },
    { 
      id: 3, 
      name: 'Analytics API', 
      key: 'sk-...ijkl9012', 
      fullKey: 'sk-analytics-1234567890abcdef1234567890abcdef12345678',
      created: '2024-01-05', 
      lastUsed: '2024-01-18',
      permissions: ['read'],
      status: 'Inactive',
      usage: { requests: 0, limit: 1000 }
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)

  const handleRegenerateKey = (keyId) => {
    const newKey = `sk-${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`
    setApiKeys(apiKeys.map(key => 
      key.id === keyId 
        ? { ...key, key: `sk-...${newKey.slice(-8)}`, fullKey: newKey, lastUsed: new Date().toISOString().split('T')[0] }
        : key
    ))
    toast.success('API key regenerated successfully')
  }

  const handleRevokeKey = (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId 
          ? { ...key, status: 'Revoked' }
          : key
      ))
      toast.success('API key revoked successfully')
    }
  }

  const handleToggleStatus = (keyId) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId 
        ? { ...key, status: key.status === 'Active' ? 'Inactive' : 'Active' }
        : key
    ))
    toast.success('API key status updated')
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">API Keys</h3>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate New Key
          </Button>
        </div>
        
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-secondary-900">{key.name}</h4>
                    <Badge variant={key.status === 'Active' ? 'success' : key.status === 'Inactive' ? 'warning' : 'danger'}>
                      {key.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-secondary-600 font-mono">{key.key}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                    <span>Created: {key.created}</span>
                    <span>Last used: {key.lastUsed}</span>
                    <span>Usage: {key.usage.requests}/{key.usage.limit} requests</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-secondary-600">Permissions:</span>
                      {key.permissions.map((permission) => (
                        <Badge key={permission} variant="primary" size="sm">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedKey(key)
                      setShowKeyModal(true)
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRegenerateKey(key.id)}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleStatus(key.id)}
                  >
                    {key.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Documentation */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">API Documentation</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Base URL</h4>
            <code className="text-sm text-blue-800">https://api.govcsr.gov.in/v1</code>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-secondary-900">Available Endpoints</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">GET /programmes</code>
                  <p className="text-xs text-secondary-600">List all programmes</p>
                </div>
                <Badge variant="success">Read</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">POST /programmes</code>
                  <p className="text-xs text-secondary-600">Create new programme</p>
                </div>
                <Badge variant="warning">Write</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">GET /beneficiaries</code>
                  <p className="text-xs text-secondary-600">List beneficiaries</p>
                </div>
                <Badge variant="success">Read</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">GET /evidence/bundles</code>
                  <p className="text-xs text-secondary-600">List evidence bundles</p>
                </div>
                <Badge variant="success">Read</Badge>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Authentication</h4>
            <p className="text-sm text-yellow-800">
              Include your API key in the Authorization header: <code>Authorization: Bearer YOUR_API_KEY</code>
            </p>
          </div>
        </div>
      </Card>

      {/* Add API Key Modal */}
      {showAddModal && (
        <AddApiKeyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(newKey) => {
            setApiKeys([...apiKeys, { ...newKey, id: apiKeys.length + 1 }])
            setShowAddModal(false)
            toast.success('API key generated successfully')
          }}
        />
      )}

      {/* View API Key Modal */}
      {showKeyModal && selectedKey && (
        <ViewApiKeyModal
          key={selectedKey}
          onClose={() => {
            setShowKeyModal(false)
            setSelectedKey(null)
          }}
        />
      )}
    </div>
  )
}

// Add API Key Modal Component
const AddApiKeyModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: ['read'],
    usageLimit: 1000
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newKey = `sk-${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`
    onSuccess({
      ...formData,
      key: `sk-...${newKey.slice(-8)}`,
      fullKey: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'Active',
      usage: { requests: 0, limit: formData.usageLimit }
    })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Generate New API Key"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Key Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Mobile App API"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Permissions</label>
          <div className="space-y-2">
            {['read', 'write', 'delete'].map((permission) => (
              <label key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, permissions: [...formData.permissions, permission] })
                    } else {
                      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permission) })
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <span className="ml-2 text-sm text-secondary-700 capitalize">{permission}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Usage Limit (requests/month)</label>
          <select
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={1000}>1,000</option>
            <option value={5000}>5,000</option>
            <option value={10000}>10,000</option>
            <option value={50000}>50,000</option>
            <option value={-1}>Unlimited</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Generate Key
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// View API Key Modal Component
const ViewApiKeyModal = ({ key, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="API Key Details"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Key Name</label>
          <p className="text-secondary-900">{key.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Full API Key</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 bg-secondary-100 rounded-lg text-sm font-mono">
              {key.fullKey}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(key.fullKey)
                toast.success('API key copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Permissions</label>
          <div className="flex items-center space-x-2">
            {key.permissions.map((permission) => (
              <Badge key={permission} variant="primary" size="sm">
                {permission}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Created</label>
            <p className="text-sm text-secondary-600">{key.created}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Last Used</label>
            <p className="text-sm text-secondary-600">{key.lastUsed}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Usage</label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Requests this month</span>
              <span>{key.usage.requests} / {key.usage.limit === -1 ? 'Unlimited' : key.usage.limit}</span>
            </div>
            {key.usage.limit !== -1 && (
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${Math.min((key.usage.requests / key.usage.limit) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </Modal>
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

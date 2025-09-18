import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  FolderOpen, 
  Users, 
  FileText, 
  Download, 
  Settings,
  Menu,
  X,
  Building2,
  Bell,
  Search,
  User,
  LogOut
} from 'lucide-react'
import Badge from './ui/Badge'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const userMenuRef = useRef(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Programmes', href: '/programmes', icon: FolderOpen },
    { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
    { name: 'Evidence', href: '/evidence', icon: FileText },
    { name: 'Exports', href: '/exports', icon: Download },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-secondary-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white to-secondary-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-secondary-900">Gov CSR</span>
              <p className="text-xs text-secondary-500">Portal</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-secondary-600 hover:bg-white hover:text-secondary-900 hover:shadow-md'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-secondary-500 group-hover:text-secondary-700'}`} />
                  {item.name}
                  {item.name === 'Dashboard' && (
                    <Badge variant="success" className="ml-auto text-xs">Live</Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5 text-secondary-500" />
              </button>
              
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search programmes, beneficiaries..."
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5 text-secondary-500" />
                <Badge variant="danger" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">3</Badge>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-secondary-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'User'}
                  </p>
                </div>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <User className="h-5 w-5 text-white" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-900">
                          {user ? `${user.firstName} ${user.lastName}` : 'User'}
                        </p>
                        <p className="text-xs text-secondary-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={async () => {
                          await logout()
                          setUserMenuOpen(false)
                          navigate('/login')
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

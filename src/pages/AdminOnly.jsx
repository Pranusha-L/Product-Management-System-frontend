import { useState, useEffect } from 'react'
import { productService } from '../services/products'

const AdminOnly = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const data = await productService.getAdminData()
      setAdminData(data)
    } catch (error) {
      setError('Failed to load admin data')
      console.error('Admin data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-card">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="admin-container fade-in">
      <div className="admin-icon">🔐</div>
      <h1 className="admin-title">Admin Panel</h1>
      <p className="admin-message">
        This is a restricted area accessible only to administrators. 
        Here you can manage system-wide settings and perform administrative tasks.
      </p>
      
      {adminData && (
        <div className="admin-card">
          <h3>Admin Information</h3>
          <p><strong>Message:</strong> {adminData.message}</p>
          <p><strong>User:</strong> {adminData.user}</p>
          <p><strong>Role:</strong> {adminData.role}</p>
          <p><strong>Access Level:</strong> Full Administrative Access</p>
        </div>
      )}
      
      <div className="admin-card">
        <h3>Administrative Functions</h3>
        <p>As an administrator, you have access to:</p>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
          <li>Full product management (create, edit, delete)</li>
          <li>User management and role assignments</li>
          <li>System configuration settings</li>
          <li>Advanced reporting and analytics</li>
          <li>Database management tools</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminOnly
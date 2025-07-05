import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/products'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await productService.getDashboardStats()
        setStats(data)
      } catch (error) {
        setError('Failed to load dashboard statistics')
        console.error('Dashboard stats error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStockBadgeClass = (status) => {
    switch (status) {
      case 'In Stock':
        return 'badge-success'
      case 'Low Stock':
        return 'badge-warning'
      case 'Out of Stock':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
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
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="dashboard-subtitle">
          Here's an overview of your product management system
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total_products || 0}</div>
          <div className="stat-label">Total Products</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(stats?.total_value || 0)}</div>
          <div className="stat-label">Total Value</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats?.low_stock_count || 0}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats?.out_of_stock_count || 0}</div>
          <div className="stat-label">Out of Stock</div>
        </div>
      </div>

      {stats?.category_stats && stats.category_stats.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Products by Category</h3>
          </div>
          <div className="card-body">
            <div className="stats-grid">
              {stats.category_stats.map((category) => (
                <div key={category.category} className="stat-card">
                  <div className="stat-value">{category.count}</div>
                  <div className="stat-label">
                    {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stats?.recent_products && stats.recent_products.length > 0 && (
        <div className="recent-products-section">
          <div className="card">
            <div className="card-header">
              <h3>Recent Products</h3>
              <Link to="/products" className="btn btn-secondary btn-small">
                View All Products
              </Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Link to={`/products/${product.id}`} className="text-primary">
                          {product.sku}
                        </Link>
                      </td>
                      <td>{product.name}</td>
                      <td>
                        <span className="badge badge-info">
                          {product.category}
                        </span>
                      </td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span className={`badge ${getStockBadgeClass(product.stock_status)}`}>
                          {product.stock_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
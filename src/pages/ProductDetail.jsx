import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productService } from '../services/products'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { hasRole } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProduct(id)
      setProduct(data)
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Product not found')
      } else {
        setError('Failed to load product details')
      }
      console.error('Product fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await productService.deleteProduct(id)
      navigate('/products')
    } catch (error) {
      alert('Failed to delete product')
      console.error('Delete error:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <p>Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-card">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/products" className="btn btn-primary mt-2">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <Link to="/products" className="btn btn-secondary">
          ← Back to Products
        </Link>
        <div className="action-group">
          {hasRole(['admin', 'manager']) && (
            <Link 
              to={`/products/${product.id}/edit`} 
              className="btn btn-primary"
            >
              Edit Product
            </Link>
          )}
          {hasRole(['admin']) && (
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete Product
            </button>
          )}
        </div>
      </div>

      <div className="product-detail-card">
        <div className="product-detail-header">
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-sku">SKU: {product.sku}</p>
        </div>

        <div className="product-detail-body">
          <div className="product-detail-grid">
            <div className="detail-item">
              <div className="detail-label">Category</div>
              <div className="detail-value">
                <span className="badge badge-info">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Price</div>
              <div className="detail-value">{formatCurrency(product.price)}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Quantity</div>
              <div className="detail-value">{product.quantity}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Stock Status</div>
              <div className="detail-value">
                <span className={`badge ${getStockBadgeClass(product.stock_status)}`}>
                  {product.stock_status}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Created By</div>
              <div className="detail-value">{product.created_by_username || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formatDate(product.created_at)}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Last Updated</div>
              <div className="detail-value">{formatDate(product.updated_at)}</div>
            </div>
          </div>

          {product.description && (
            <div className="detail-item">
              <div className="detail-label">Description</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
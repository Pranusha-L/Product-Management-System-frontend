import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/products'
import { useAuth } from '../contexts/AuthContext'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { hasRole } = useAuth()

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'other', label: 'Other' },
  ]

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (category !== 'all') params.category = category
      
      const data = await productService.getProducts(params)
      setProducts(data.results || data)
    } catch (error) {
      setError('Failed to load products')
      console.error('Products fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await productService.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
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

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        {hasRole(['admin', 'manager']) && (
          <Link to="/products/create" className="btn btn-primary">
            Add New Product
          </Link>
        )}
      </div>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control filter-select"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-card">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    {search || category !== 'all' 
                      ? 'No products found matching your criteria'
                      : 'No products available'
                    }
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                    <td>{product.created_by_username || 'N/A'}</td>
                    <td>
                      <div className="action-group">
                        <Link 
                          to={`/products/${product.id}`} 
                          className="btn btn-secondary btn-small"
                        >
                          View
                        </Link>
                        {hasRole(['admin', 'manager']) && (
                          <>
                            <Link 
                              to={`/products/${product.id}/edit`} 
                              className="btn btn-primary btn-small"
                            >
                              Edit
                            </Link>
                            {hasRole(['admin']) && (
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="btn btn-danger btn-small"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductList
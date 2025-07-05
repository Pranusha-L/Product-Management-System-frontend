import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/products'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: 'other',
    price: '',
    quantity: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const categories = [
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
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setInitialLoading(true)
      const product = await productService.getProduct(id)
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString()
      })
    } catch (error) {
      setErrors({ general: 'Failed to load product details' })
      console.error('Product fetch error:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      }
      
      await productService.updateProduct(id, productData)
      navigate(`/products/${id}`)
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({ general: 'Failed to update product. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Edit Product</h1>
        <div className="action-group">
          <Link to={`/products/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </div>

      {errors.general && (
        <div className="error-card">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`form-control ${errors.sku ? 'error' : ''}`}
              placeholder="e.g., ELEC-001"
              required
            />
            {errors.sku && (
              <div className="error-message">{errors.sku}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'error' : ''}`}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="Enter product name"
            required
          />
          {errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-control ${errors.description ? 'error' : ''}`}
            placeholder="Enter product description..."
            rows="4"
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (USD) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-control ${errors.price ? 'error' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`form-control ${errors.quantity ? 'error' : ''}`}
              placeholder="0"
              min="0"
              required
            />
            {errors.quantity && (
              <div className="error-message">{errors.quantity}</div>
            )}
          </div>
        </div>

        <div className="action-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating Product...' : 'Update Product'}
          </button>
          <Link to={`/products/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
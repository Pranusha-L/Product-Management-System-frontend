import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-container fade-in">
      <div className="not-found-icon">404</div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-large">
        Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
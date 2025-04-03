import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PropTypes from 'prop-types';

/**
 * PrivateRouteWrapper component handles route protection based on authentication
 * and user roles. It redirects unauthorized users to the login page.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Array of roles allowed to access the route
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @returns {React.ReactElement} The appropriate component based on auth state
 */

const PrivateRouteWrapper = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const location = useLocation();
  const { user, isLoaded } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't proceed until auth store is fully loaded
    if (!isLoaded) return;

    // Check if user is authenticated when required
    if (requireAuth && !user) {
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    // If authentication is not required, or there are no role restrictions
    if (!requireAuth || allowedRoles.length === 0) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Check if user has one of the allowed roles
    if (user && allowedRoles.includes(user.role)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsChecking(false);
  }, [user, isLoaded, requireAuth, allowedRoles]);

  // Show loading state until we've checked authorization
  if (isChecking || !isLoaded) {
    return <LoadingSpinner />;
  }

  // If not authorized, redirect to login with return URL
  if (!isAuthorized) {
    // For roles mismatch but authenticated users, redirect to home
    if (user && requireAuth && allowedRoles.length > 0) {
      return <Navigate to="/" replace />;
    }
    
    // For unauthenticated users, redirect to login
    return (
      <Navigate
        to={`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If user is authenticated and authorized, render the children
  return children;
};

PrivateRouteWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireAuth: PropTypes.bool,
};

export default PrivateRouteWrapper;
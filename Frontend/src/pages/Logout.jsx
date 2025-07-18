import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated, setCurrentUserRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false);
    setCurrentUserRole(""); 
    localStorage.removeItem('token');
    navigate("/", { replace: true });
  }, [setIsAuthenticated, setCurrentUserRole, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
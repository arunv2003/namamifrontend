import React, { createContext, useContext, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { EmployeeRoute } from '../routes/auth/login.route.js';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = Cookies.get('user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user session cookie:', e);
        return null;
      }
    }
    return null;
  });

  const [roleInfo, setRoleInfo] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoadingPermissions(true);
      const res = await EmployeeRoute.getPermissions();
      if (res && res.success && res.data) {
        setRoleInfo({
          id: res.data.id,
          name: res.data.name,
          slug: res.data.slug,
          status: res.data.status,
          role_custom_id: res.data.role_custom_id,
        });
        let permData = res.data.permission || {};
        while (permData && permData.permission && typeof permData.permission === 'object') {
          permData = permData.permission;
        }
        setPermissions(permData);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      Cookies.set('accessToken', token, { expires: 1, path: '/' });
    }
    Cookies.set('user_session', JSON.stringify(userData), { expires: 1, path: '/' });
    fetchPermissions();
    return userData;
  };

  const logout = async () => {
    try {
      const result = await EmployeeRoute.logout();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Failed to logout on server:', err);
      toast.error('Failed to logout');
    } finally {
      setUser(null);
      setRoleInfo(null);
      setPermissions(null);
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('user_session', { path: '/' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roleInfo,
        permissions,
        loadingPermissions,
        fetchPermissions,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

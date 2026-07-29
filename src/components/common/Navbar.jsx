import React, { useState, useEffect } from 'react';
import {
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Collapse,
  CircularProgress,
} from '@mui/material';

// MUI Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { attendanceRoute } from '../../routes/attendance/attendance.route';
import { toast } from 'react-toastify';

export default function Navbar({
  user: propUser,
  logout: propLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const user = propUser || auth?.user;
  const logout = propLogout || auth?.logout;

  // Determine active tab based on current path
  const getCurrentTab = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname.startsWith('/employees') || location.pathname.includes('employee')) return 'Employee';
    if (location.pathname.startsWith('/tasks')) return 'Team Task';
    if (location.pathname.startsWith('/customers')) return 'Customers';
    if (location.pathname.startsWith('/attendance')) return 'Attendance';
    if (location.pathname === '/home') return 'Home';
    return 'Home';
  };
  const [activeTab, setActiveTab] = useState(getCurrentTab());

  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Mobile Drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState({});

  // Nav items dropdown anchor state
  const [navDropdownAnchorEl, setNavDropdownAnchorEl] = useState(null);
  const [activeDropdownNav, setActiveDropdownNav] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);

  const handleTabClick = (event, item) => {
    if (item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0) {
      setNavDropdownAnchorEl(event.currentTarget);
      setActiveDropdownNav(item);
      return;
    }

    setActiveTab(item.label);
    if (item.path) {
      navigate(item.path);
    } else if (item.label === 'Home') {
      navigate('/home');
    } else if (item.label === 'Dashboard') {
      navigate('/dashboard');
    } else if (item.label === 'Employee') {
      navigate('/employees');
    } else if (item.label === 'Team Task') {
      navigate('/tasks/all');
    }
  };

  const handleMobileToggleExpand = (itemLabel) => {
    setMobileExpandedItems((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  // Punch in/out state & backend integration
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isPunchedOutToday, setIsPunchedOutToday] = useState(false);
  const [punchSeconds, setPunchSeconds] = useState(0);
  const [punchLoading, setPunchLoading] = useState(false);

  // User menu anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Role menu anchor element
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const isRoleMenuOpen = Boolean(roleAnchorEl);

  // Settings menu anchor element
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const isSettingsMenuOpen = Boolean(settingsAnchorEl);

  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceRoute.getTodayAttendance(user?.id || '');
      if (response && (response.success || response.statusCode === 200) && response.data) {
        const { isClockedIn, isClockedOut, attendance } = response.data;
        setIsPunchedIn(Boolean(isClockedIn));
        setIsPunchedOutToday(Boolean(isClockedOut));

        if (isClockedIn && attendance?.clock_in) {
          const clockInTime = new Date(attendance.clock_in).getTime();
          const now = Date.now();
          const diffInSeconds = Math.max(0, Math.floor((now - clockInTime) / 1000));
          setPunchSeconds(diffInSeconds);
        } else if (isClockedOut && attendance?.clock_out) {
          const clockOutTime = new Date(attendance.clock_out).getTime();
          const now = Date.now();
          const diffInSeconds = Math.max(0, Math.floor((now - clockOutTime) / 1000));
          setPunchSeconds(diffInSeconds);
        } else {
          setPunchSeconds(0);
        }
      }
    } catch (err) {
      console.error("Error fetching today's attendance in Navbar:", err);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPunchSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPunchTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m ago`;
    }
    return `${mins}m ${secs}s ago`;
  };

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation positioning error:", error);
          resolve({ latitude: null, longitude: null });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handlePunchToggle = async () => {
    if (punchLoading) return;
    setPunchLoading(true);

    try {
      const locationCoords = await getUserLocation();

      if (!isPunchedIn) {
        const res = await attendanceRoute.clockIn({
          latitude: locationCoords.latitude,
          longitude: locationCoords.longitude,
        });

        if (res && (res.success || res.statusCode === 201 || res.statusCode === 200)) {
          toast.success(res.message || "Clocked in successfully!");
          setIsPunchedIn(true);
          setIsPunchedOutToday(false);
          setPunchSeconds(0);
          await fetchTodayAttendance();
        }
      } else {
        const res = await attendanceRoute.clockOut({
          latitude: locationCoords.latitude,
          longitude: locationCoords.longitude,
        });

        if (res && (res.success || res.statusCode === 201 || res.statusCode === 200)) {
          toast.success(res.message || "Clocked out successfully!");
          setIsPunchedIn(false);
          setIsPunchedOutToday(true);
          setPunchSeconds(0);
          await fetchTodayAttendance();
        }
      }
    } catch (err) {
      console.error("Error during punch action:", err);
    } finally {
      setPunchLoading(false);
    }
  };

  const permissions = auth?.permissions;
  const roleInfo = auth?.roleInfo;

  // Check if user has permission for a specific module
  const checkPermission = (itemKey) => {
    if (!permissions) return true;
    if (!itemKey) return true;

    let actualPerms = permissions;
    while (actualPerms && actualPerms.permission && typeof actualPerms.permission === 'object') {
      actualPerms = actualPerms.permission;
    }

    const perm = actualPerms[itemKey] || actualPerms[itemKey.toLowerCase()];
    if (!perm) return false;

    if (typeof perm === 'boolean') return perm;
    if (typeof perm === 'object') {
      return Object.values(perm).some((val) => val === true);
    }
    return false;
  };

  const navItems = [
    { label: 'Home', path: '/home', hasDropdown: false, permissionKey: null, icon: <HomeIcon fontSize="small" /> },
    { label: 'Dashboard', path: '/dashboard', hasDropdown: false, permissionKey: null, icon: <DashboardIcon fontSize="small" /> },
    { label: 'Employee', path: '/employees', hasDropdown: false, permissionKey: 'employee', icon: <PeopleIcon fontSize="small" /> },
    {
      label: 'Team Task',
      path: '/tasks/all',
      hasDropdown: true,
      permissionKey: 'task',
      icon: <AssignmentIcon fontSize="small" />,
      dropdownItems: [
        { label: 'Task All', path: '/tasks/all' },
        { label: 'Team Task', path: '/tasks/team' },
        { label: 'Task Customer', path: '/tasks/task-customer' },
        { label: 'Onboarding Task', path: '/tasks/task-on-boarding' },
        { label: 'Deleted Tasks', path: '/tasks/deleted' },
      ],
    },
    { label: 'Customers', path: '/customers', hasDropdown: false, permissionKey: 'customer' },
    {
      label: 'Payment',
      path: '/home',
      hasDropdown: true,
      permissionKey: 'payment',
      dropdownItems: [
        { label: 'Payment Transactions', path: '/home' },
        { label: 'Invoices', path: '/home' },
      ],
    },
    {
      label: 'Leave',
      path: '/home',
      hasDropdown: true,
      permissionKey: 'leave',
      dropdownItems: [
        { label: 'Leave Requests', path: '/home' },
        { label: 'Leave Types', path: '/home' },
      ],
    },
    {
      label: 'Attendance',
      path: '/attendance/details',
      hasDropdown: true,
      permissionKey: 'attendance',
      dropdownItems: [
        { label: 'Attendance Details', path: '/attendance/details' },
        { label: 'Monthly Attendance', path: '/attendance/monthly' },
      ],
    },
    { label: 'Feeds', path: '/home', hasDropdown: false, permissionKey: 'feeds' },
    { label: 'Reports', path: '/home', hasDropdown: false, permissionKey: 'reports' },
    {
      label: 'All Analytics',
      path: '/home',
      hasDropdown: true,
      permissionKey: 'analytics',
      dropdownItems: [
        { label: 'Overview', path: '/home' },
        { label: 'Task Metrics', path: '/home' },
      ],
    },
    { label: 'Contacts', path: '/contacts', hasDropdown: false, permissionKey: 'contacts' },
    { label: 'Public Form Data', path: '/home', hasDropdown: false, permissionKey: 'public_form' },
    { label: 'Integration', path: '/home', hasDropdown: false, permissionKey: 'integration' },
    { label: 'Admin', path: '/home', hasDropdown: false, permissionKey: 'admin' },
  ];

  const [maxVisibleCount, setMaxVisibleCount] = useState(() => {
    if (typeof window === 'undefined') return 10;
    const w = window.innerWidth;
    if (w >= 1600) return 12;
    if (w >= 1400) return 10;
    if (w >= 1200) return 8;
    if (w >= 1024) return 7;
    if (w >= 768) return 5;
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1600) setMaxVisibleCount(12);
      else if (w >= 1400) setMaxVisibleCount(10);
      else if (w >= 1200) setMaxVisibleCount(8);
      else if (w >= 1024) setMaxVisibleCount(7);
      else if (w >= 768) setMaxVisibleCount(5);
      else setMaxVisibleCount(4);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleNavItems = navItems.filter((item) => checkPermission(item.permissionKey));
  const primaryNavItems = visibleNavItems.slice(0, maxVisibleCount);
  const extraNavItems = visibleNavItems.slice(maxVisibleCount);

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'K';

  return (
    <>
      {/* Pinned Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full px-3 sm:px-5 py-2 flex items-center justify-between transition-colors duration-200 border-b backdrop-blur-md ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-white shadow-md'
            : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        {/* Left side: Location Pin Logo & Hamburger Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Brand Pin Icon */}
          <div
            onClick={() => navigate('/home')}
            className="relative flex items-center justify-center cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm transition-transform group-hover:scale-105">
              <LocationOnIcon sx={{ fontSize: 22, color: '#f97316' }} />
            </div>
          </div>

          {/* Hamburger menu icon */}
          <IconButton
            size="small"
            aria-label="open drawer"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{
              color: isDark ? '#cbd5e1' : '#334155',
              '&:hover': { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </div>

        {/* Navigation menu list - Desktop Horizontal Bar */}
        <nav
          className="flex items-center gap-1 sm:gap-2 lg:gap-3 mx-2 py-1 flex-1 min-w-0 flex-nowrap overflow-hidden no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <div key={item.label} className="relative flex-shrink-0">
                <button
                  onClick={(e) => handleTabClick(e, item)}
                  className={`flex items-center gap-0.5 px-2.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap rounded-md ${
                    isActive
                      ? isDark
                        ? 'text-blue-400 font-bold bg-blue-950/40'
                        : 'text-blue-600 font-bold bg-blue-50/80'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: 16,
                        color: isActive
                          ? isDark
                            ? '#60a5fa'
                            : '#2563eb'
                          : isDark
                          ? '#94a3b8'
                          : '#64748b',
                      }}
                    />
                  )}
                </button>
                {/* Active Tab Blue Underline */}
                {isActive && (
                  <div
                    className={`absolute bottom-0 left-1 right-1 h-[2.5px] rounded-t-sm ${
                      isDark ? 'bg-blue-400' : 'bg-blue-600'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side controls: 3-dots menu, Punch status, Manager role badge & User avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* 3 Dots Extra Nav Items Menu Button */}
          {extraNavItems.length > 0 && (
            <div className="relative">
              <Tooltip title="More Modules">
                <IconButton
                  onClick={(e) => setMoreMenuAnchorEl(e.currentTarget)}
                  size="small"
                  sx={{
                    color: extraNavItems.some((i) => i.label === activeTab)
                      ? (isDark ? '#60a5fa' : '#2563eb')
                      : (isDark ? '#cbd5e1' : '#475569'),
                    backgroundColor: extraNavItems.some((i) => i.label === activeTab)
                      ? (isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.08)')
                      : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    p: 0.8,
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Extra Nav Items Dropdown Menu */}
              <Menu
                anchorEl={moreMenuAnchorEl}
                open={Boolean(moreMenuAnchorEl)}
                onClose={() => setMoreMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 190,
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'}`,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    },
                  },
                }}
              >
                {extraNavItems.map((item) => {
                  const isActive = activeTab === item.label;
                  if (item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0) {
                    return (
                      <React.Fragment key={item.label}>
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-t first:border-t-0 border-slate-200 dark:border-slate-800 mt-1 first:mt-0">
                          {item.label}
                        </div>
                        {item.dropdownItems.map((sub) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <MenuItem
                              key={sub.label}
                              selected={isSubActive}
                              onClick={() => {
                                setMoreMenuAnchorEl(null);
                                setActiveTab(item.label);
                                if (sub.path) navigate(sub.path);
                              }}
                              sx={{
                                fontSize: '0.825rem',
                                pl: 3,
                                fontWeight: isSubActive ? 700 : 500,
                                color: isSubActive ? (isDark ? '#60a5fa' : '#2563eb') : 'inherit',
                                py: 0.75,
                              }}
                            >
                              <ListItemText
                                primary={sub.label}
                                primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: isSubActive ? 700 : 500 }}
                              />
                              {isSubActive && <CheckCircleIcon sx={{ fontSize: 14, ml: 1, color: isDark ? '#60a5fa' : '#2563eb' }} />}
                            </MenuItem>
                          );
                        })}
                      </React.Fragment>
                    );
                  }

                  return (
                    <MenuItem
                      key={item.label}
                      selected={isActive}
                      onClick={() => {
                        setMoreMenuAnchorEl(null);
                        setActiveTab(item.label);
                        if (item.path) navigate(item.path);
                      }}
                      sx={{
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? (isDark ? '#60a5fa' : '#2563eb') : 'inherit',
                        py: 1,
                        px: 2,
                      }}
                    >
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: isActive ? 700 : 500 }} />
                    </MenuItem>
                  );
                })}
              </Menu>
            </div>
          )}

          {/* Punch In / Punched Out Attendance Status Badge */}
          <Tooltip title={punchLoading ? 'Processing...' : isPunchedIn ? 'Click to Punch Out' : 'Click to Punch In'}>
            <button
              onClick={handlePunchToggle}
              disabled={punchLoading}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                punchLoading ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                isPunchedIn
                  ? isDark
                    ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center shrink-0">
                {punchLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <>
                    <FingerprintIcon
                      sx={{
                        fontSize: 22,
                        color: isPunchedIn ? '#10b981' : isDark ? '#cbd5e1' : '#475569',
                      }}
                    />
                    <div className="absolute -top-0.5 -right-0.5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center p-[0.5px]">
                      {isPunchedIn ? (
                        <CheckCircleIcon sx={{ fontSize: 11, color: '#10b981' }} />
                      ) : (
                        <CancelIcon sx={{ fontSize: 11, color: '#ef4444' }} />
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-[11px] font-bold tracking-tight">
                  {punchLoading ? 'Updating...' : isPunchedIn ? 'Punched In' : 'Punched Out'}
                </p>
                <p className="text-[10px] opacity-75 font-mono">
                  {formatPunchTime(punchSeconds)}
                </p>
              </div>
            </button>
          </Tooltip>

          {/* Settings Icon Button */}
          <Tooltip title="App Settings">
            <IconButton
              onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
              size="small"
              sx={{
                color: isDark ? '#cbd5e1' : '#475569',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1',
                borderRadius: '10px',
                p: 0.8,
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Settings Menu Popup */}
          <Menu
            anchorEl={settingsAnchorEl}
            open={isSettingsMenuOpen}
            onClose={() => setSettingsAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: '14px',
                  mt: 1.5,
                  minWidth: 200,
                  padding: '4px',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                },
              },
            }}
          >

            <MenuItem
              onClick={() => {
                toggleTheme();
                setSettingsAnchorEl(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              New Office 
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSettingsAnchorEl(null);
                navigate('/role-permission');
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
             Role & Permission Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleTheme();
                setSettingsAnchorEl(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              Holiday Settings 
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSettingsAnchorEl(null);
                navigate('/department-settings');
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
             Department Settings
            </MenuItem>
          </Menu>

          {/* Dynamic Role Badge (Horizontal Inline Layout) */}
          <Tooltip title={`Current Role: ${roleInfo?.name || 'Admin'}`}>
            <button
              onClick={(e) => setRoleAnchorEl(e.currentTarget)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                isDark
                  ? 'bg-blue-950/40 border-blue-800/80 text-blue-300 hover:bg-blue-900/50'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <EngineeringIcon sx={{ fontSize: 18, color: isDark ? '#60a5fa' : '#2563eb' }} />
              <span className="text-xs font-bold whitespace-nowrap hidden xs:inline">
                {roleInfo?.name || 'Admin'}
              </span>
              <KeyboardArrowDownIcon sx={{ fontSize: 14, opacity: 0.7 }} />
            </button>
          </Tooltip>

          {/* Role Menu Popup */}
          <Menu
            anchorEl={roleAnchorEl}
            open={isRoleMenuOpen}
            onClose={() => setRoleAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  borderRadius: '12px',
                  mt: 1,
                  minWidth: 160,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                },
              },
            }}
          >
            <MenuItem onClick={() => setRoleAnchorEl(null)} selected>
              <ListItemText primary="Admin Role" secondary="Full Access" />
            </MenuItem>
            <MenuItem onClick={() => setRoleAnchorEl(null)}>
              <ListItemText primary="Manager View" />
            </MenuItem>
            <MenuItem onClick={() => setRoleAnchorEl(null)}>
              <ListItemText primary="Employee View" />
            </MenuItem>
          </Menu>

          {/* User Initial Avatar Circle */}
          <Tooltip title={user?.name || 'User Profile'}>
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95 focus:outline-none shrink-0"
            >
              {userInitial}
            </button>
          </Tooltip>

          {/* User Profile & Settings Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: '14px',
                  mt: 1.5,
                  minWidth: 220,
                  padding: '4px',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                },
              },
            }}
          >
            <div className="px-4 py-2.5">
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.name || 'Administrator'}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {user?.email || 'admin@company.com'}
              </p>
            </div>

            <Divider sx={{ my: 0.5, borderColor: isDark ? '#334155' : '#f1f5f9' }} />

            <MenuItem
              onClick={() => {
                toggleTheme();
                setAnchorEl(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <ListItemIcon sx={{ color: isDark ? '#f59e0b' : '#0f172a' }}>
                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText primary={isDark ? 'Light Mode' : 'Dark Mode'} />
            </MenuItem>

            <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: '8px', py: 1 }}>
              <ListItemIcon sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Account Profile" />
            </MenuItem>

            {logout && (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  logout();
                }}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  color: isDark ? '#f87171' : '#dc2626',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            )}
          </Menu>

          {/* Nav Items Submenu Dropdown - Positioned directly beneath anchor */}
          <Menu
            anchorEl={navDropdownAnchorEl}
            open={Boolean(navDropdownAnchorEl)}
            onClose={() => setNavDropdownAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: '12px',
                  mt: 1,
                  minWidth: 180,
                  padding: '6px',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  boxShadow: isDark
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                },
              },
            }}
          >
            {activeDropdownNav?.dropdownItems?.map((subItem) => {
              const isSubActive = location.pathname === subItem.path;
              return (
                <MenuItem
                  key={subItem.label}
                  selected={isSubActive}
                  onClick={() => {
                    setNavDropdownAnchorEl(null);
                    setActiveTab(activeDropdownNav.label);
                    if (subItem.path) {
                      navigate(subItem.path);
                    }
                  }}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    px: 2,
                    fontWeight: isSubActive ? 700 : 500,
                    backgroundColor: isSubActive
                      ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)'
                      : 'transparent',
                    color: isSubActive
                      ? isDark ? '#60a5fa' : '#2563eb'
                      : isDark ? '#e2e8f0' : '#334155',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                    },
                  }}
                >
                  <ListItemText
                    primary={subItem.label}
                    primaryTypographyProps={{
                      fontSize: '13px',
                      fontWeight: isSubActive ? 700 : 500,
                      color: 'inherit',
                    }}
                  />
                  {isSubActive && <CheckCircleIcon sx={{ fontSize: 14, ml: 1, color: isDark ? '#60a5fa' : '#2563eb' }} />}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      </header>

      {/* Mobile Drawer Navigation Sidebar */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
              borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Drawer Header Banner */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm">
              <LocationOnIcon sx={{ fontSize: 20, color: '#f97316' }} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold leading-tight">Employee Portal</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Navigation Menu</p>
            </div>
          </div>
          <IconButton onClick={() => setMobileDrawerOpen(false)} size="small">
            <CloseIcon fontSize="small" sx={{ color: isDark ? '#cbd5e1' : '#475569' }} />
          </IconButton>
        </div>

        {/* User Card inside Drawer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Avatar sx={{ bgcolor: '#2563eb', width: 38, height: 38, fontWeight: 'bold' }}>
            {userInitial}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'admin@company.com'}</p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.label;
            const hasSub = item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0;
            const isExpanded = Boolean(mobileExpandedItems[item.label]);

            return (
              <div key={item.label} className="w-full">
                <button
                  onClick={(e) => {
                    if (hasSub) {
                      handleMobileToggleExpand(item.label);
                    } else {
                      setMobileDrawerOpen(false);
                      handleTabClick(e, item);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-800/60'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon ? (
                      <span className={isActive ? 'text-blue-500' : 'text-slate-400'}>{item.icon}</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  {hasSub && (
                    <span>
                      {isExpanded ? (
                        <ExpandLessIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                      )}
                    </span>
                  )}
                </button>

                {/* Submenu Accordion for Mobile */}
                {hasSub && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <div className="pl-6 pr-2 py-1 space-y-1">
                      {item.dropdownItems.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            setActiveTab(item.label);
                            if (subItem.path) {
                              navigate(subItem.path);
                            }
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </Collapse>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => {
              toggleTheme();
              setMobileDrawerOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200"
          >
            <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            {isDark ? <LightModeIcon fontSize="small" sx={{ color: '#f59e0b' }} /> : <DarkModeIcon fontSize="small" />}
          </button>

          {logout && (
            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </Drawer>
    </>
  );
}


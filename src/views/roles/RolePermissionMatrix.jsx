import React, { useState } from 'react';
import {
  Checkbox,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BadgeIcon from '@mui/icons-material/Badge';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import PinDropIcon from '@mui/icons-material/PinDrop';
import BusinessIcon from '@mui/icons-material/Business';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import { useThemeMode } from '../../contexts/ThemeContext';

// Tree structure for modules and sub-modules matching API schema
export const MODULE_TREE = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    category: 'General',
    description: 'Dashboard metrics and overview statistics',
    icon: DashboardIcon,
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  },
  {
    key: 'task',
    name: 'Tasks & Delegation',
    category: 'Operations',
    description: 'Task creation, status tracking, customer & onboarding tasks',
    icon: AssignmentIcon,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    subModules: [
      { key: 'taskAll', name: 'Task All', description: 'All company tasks and assignments' },
      { key: 'teamTask', name: 'Team Task', description: 'Tasks delegated to team members' },
      { key: 'taskCustomer', name: 'Task Customer', description: 'Customer related tasks and support items' },
      { key: 'onboardingTask', name: 'Onboarding Task', description: 'Onboarding workflows for users and clients' },
      { key: 'deletedTasks', name: 'Deleted Tasks', description: 'Archived and deleted task records' },
    ],
  },
  {
    key: 'employee',
    name: 'Employees & Staff',
    category: 'HR & Personnel',
    description: 'Employee profiles, credentials, identity, and staff directory',
    icon: BadgeIcon,
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    subModules: [
      { key: 'allEmployee', name: 'All Employee', description: 'Full employee directory and staff profiles' },
      { key: 'myTeam', name: 'My Team', description: 'Direct team members and reporting structure' },
    ],
  },
  {
    key: 'attendance',
    name: 'Attendance & Time Logs',
    category: 'HR & Personnel',
    description: 'Daily attendance logs, punch status, and monthly summaries',
    icon: HowToRegIcon,
    accentColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    subModules: [
      { key: 'attendanceDetails', name: 'Attendance Details', description: 'Daily attendance clock-in logs and status' },
      { key: 'monthlyAttendance', name: 'Monthly Attendance', description: 'Monthly summary reports and working hours' },
    ],
  },
  {
    key: 'role',
    name: 'Roles & Permissions',
    category: 'System',
    description: 'User access levels, role definition, and permission matrix',
    icon: SecurityIcon,
    accentColor: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
  },
  {
    key: 'admin',
    name: 'Admin Panel',
    category: 'System',
    description: 'System administration and controls',
    icon: AdminPanelSettingsIcon,
    accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  },
  {
    key: 'department',
    name: 'Department',
    category: 'Organization',
    description: 'Company departments and business units',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
  },
  {
    key: 'designation',
    name: 'Designation',
    category: 'Organization',
    description: 'Employee job titles and designations',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
  },
  {
    key: 'branch',
    name: 'Branch Offices',
    category: 'Organization',
    description: 'Office branches and locations',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
  },
  {
    key: 'leave',
    name: 'Leave Management',
    category: 'HR & Personnel',
    description: 'Leave applications and approvals',
    icon: HowToRegIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    key: 'holiday',
    name: 'Holidays',
    category: 'HR & Personnel',
    description: 'Company holiday calendar',
    icon: HowToRegIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    key: 'feeds',
    name: 'Feeds & Announcements',
    category: 'Communication',
    description: 'Company announcements and posts',
    icon: RssFeedIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    key: 'reports',
    name: 'Reports & Analytics',
    category: 'Analytics',
    description: 'System reports and analytics',
    icon: RssFeedIcon,
    accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  }
];

// Flat export for backwards compatibility
export const ALL_PROJECT_MODULES = MODULE_TREE.flatMap((mod) => {
  if (mod.subModules && mod.subModules.length > 0) {
    return mod.subModules.map((sub) => ({
      key: `${mod.key}.${sub.key}`,
      parentKey: mod.key,
      subKey: sub.key,
      name: `${mod.name} - ${sub.name}`,
      category: mod.category,
      description: sub.description,
      icon: mod.icon,
      accentColor: mod.accentColor,
    }));
  }
  return [mod];
});

export const PERMISSION_COLUMNS = [
  { key: 'add', label: 'Add', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { key: 'edit', label: 'Edit', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { key: 'delete', label: 'Delete', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { key: 'allView', label: 'All View', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { key: 'ownView', label: 'Own View', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
];

export default function RolePermissionMatrix({
  permissions = {},
  onChange = () => {},
  isReadOnly = false,
}) {
  const { isDark } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Track expanded parent modules
  const [expanded, setExpanded] = useState(() => {
    const initial = {};
    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        initial[mod.key] = true; // expanded by default
      }
    });
    return initial;
  });

  const toggleExpand = (parentKey) => {
    setExpanded((prev) => ({
      ...prev,
      [parentKey]: !prev[parentKey],
    }));
  };

  const handleExpandAll = (shouldExpand) => {
    const next = {};
    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        next[mod.key] = shouldExpand;
      }
    });
    setExpanded(next);
  };

  // Helper to read safe permission object for a flat module or sub-module
  const getPermObj = (parentKey, subKey = null) => {
    if (subKey) {
      const nestedSub = permissions[parentKey]?.[subKey];
      const flatDotSub = permissions[`${parentKey}.${subKey}`];
      const directSub = permissions[subKey];

      if (nestedSub || flatDotSub || directSub) {
        return {
          add: Boolean(nestedSub?.add || flatDotSub?.add || directSub?.add),
          edit: Boolean(nestedSub?.edit || flatDotSub?.edit || directSub?.edit),
          delete: Boolean(nestedSub?.delete || flatDotSub?.delete || directSub?.delete),
          allView: Boolean(nestedSub?.allView || flatDotSub?.allView || directSub?.allView),
          ownView: Boolean(nestedSub?.ownView || flatDotSub?.ownView || directSub?.ownView),
        };
      }

      // Fallback if parent has permissions directly
      const parentPerm = permissions[parentKey];
      if (
        parentPerm &&
        typeof parentPerm === 'object' &&
        ('add' in parentPerm || 'allView' in parentPerm || 'ownView' in parentPerm)
      ) {
        return {
          add: Boolean(parentPerm.add),
          edit: Boolean(parentPerm.edit),
          delete: Boolean(parentPerm.delete),
          allView: Boolean(parentPerm.allView),
          ownView: Boolean(parentPerm.ownView),
        };
      }
      return { add: false, edit: false, delete: false, allView: false, ownView: false };
    }

    const target = permissions[parentKey];
    if (target && typeof target === 'object') {
      return {
        add: Boolean(target.add),
        edit: Boolean(target.edit),
        delete: Boolean(target.delete),
        allView: Boolean(target.allView),
        ownView: Boolean(target.ownView),
      };
    }
    return { add: false, edit: false, delete: false, allView: false, ownView: false };
  };

  // Toggle single permission checkbox
  const handleToggleSingle = (parentKey, subKey, permKey) => {
    if (isReadOnly) return;
    const current = getPermObj(parentKey, subKey);
    const newValue = !current[permKey];

    const updatedNode = {
      ...current,
      [permKey]: newValue,
    };

    if (permKey === 'allView') {
      if (newValue) updatedNode.ownView = true;
    } else if (permKey === 'ownView') {
      if (!newValue) updatedNode.allView = false;
    }

    const updatedPermissions = { ...permissions };

    if (subKey) {
      delete updatedPermissions[`${parentKey}.${subKey}`];
      delete updatedPermissions[subKey];

      const parentObj =
        typeof updatedPermissions[parentKey] === 'object' && updatedPermissions[parentKey] !== null
          ? { ...updatedPermissions[parentKey] }
          : {};

      parentObj[subKey] = updatedNode;
      updatedPermissions[parentKey] = parentObj;
    } else {
      updatedPermissions[parentKey] = updatedNode;
    }

    onChange(updatedPermissions);
  };

  // Toggle column for parent module (applies action to ALL its sub-modules)
  const handleToggleParentColumn = (parentMod, permKey) => {
    if (isReadOnly) return;
    const subMods = parentMod.subModules || [];
    const isAllChecked = subMods.every((sub) => getPermObj(parentMod.key, sub.key)[permKey]);
    const targetValue = !isAllChecked;

    const updatedPermissions = { ...permissions };
    const parentObj =
      typeof updatedPermissions[parentMod.key] === 'object' && updatedPermissions[parentMod.key] !== null
        ? { ...updatedPermissions[parentMod.key] }
        : {};

    subMods.forEach((sub) => {
      delete updatedPermissions[`${parentMod.key}.${sub.key}`];
      delete updatedPermissions[sub.key];

      const cur = getPermObj(parentMod.key, sub.key);
      const updatedSub = {
        ...cur,
        [permKey]: targetValue,
      };
      if (permKey === 'allView' && targetValue) {
        updatedSub.ownView = true;
      } else if (permKey === 'ownView' && !targetValue) {
        updatedSub.allView = false;
      }
      parentObj[sub.key] = updatedSub;
    });

    updatedPermissions[parentMod.key] = parentObj;
    onChange(updatedPermissions);
  };

  // Toggle ALL permissions for a parent module row (applies all 5 actions across ALL sub-modules)
  const handleToggleParentRow = (parentMod) => {
    if (isReadOnly) return;
    const subMods = parentMod.subModules || [];

    const isAllMasterChecked = subMods.every((sub) => {
      const cur = getPermObj(parentMod.key, sub.key);
      return PERMISSION_COLUMNS.every((col) => cur[col.key]);
    });

    const targetState = {
      add: !isAllMasterChecked,
      edit: !isAllMasterChecked,
      delete: !isAllMasterChecked,
      allView: !isAllMasterChecked,
      ownView: !isAllMasterChecked,
    };

    const updatedPermissions = { ...permissions };
    const parentObj =
      typeof updatedPermissions[parentMod.key] === 'object' && updatedPermissions[parentMod.key] !== null
        ? { ...updatedPermissions[parentMod.key] }
        : {};

    subMods.forEach((sub) => {
      delete updatedPermissions[`${parentMod.key}.${sub.key}`];
      delete updatedPermissions[sub.key];
      parentObj[sub.key] = { ...targetState };
    });

    updatedPermissions[parentMod.key] = parentObj;
    onChange(updatedPermissions);
  };

  // Toggle row for flat single module
  const handleToggleFlatRow = (modKey) => {
    if (isReadOnly) return;
    const current = getPermObj(modKey);
    const isAllChecked = PERMISSION_COLUMNS.every((col) => current[col.key]);

    const targetState = {
      add: !isAllChecked,
      edit: !isAllChecked,
      delete: !isAllChecked,
      allView: !isAllChecked,
      ownView: !isAllChecked,
    };

    onChange({
      ...permissions,
      [modKey]: targetState,
    });
  };

  // Toggle global column across ALL modules and sub-modules
  const handleToggleGlobalColumn = (permKey) => {
    if (isReadOnly) return;
    let isAllGlobalChecked = true;

    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        mod.subModules.forEach((sub) => {
          if (!getPermObj(mod.key, sub.key)[permKey]) isAllGlobalChecked = false;
        });
      } else {
        if (!getPermObj(mod.key)[permKey]) isAllGlobalChecked = false;
      }
    });

    const targetValue = !isAllGlobalChecked;
    const nextPermissions = { ...permissions };

    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        const parentObj =
          typeof nextPermissions[mod.key] === 'object' && nextPermissions[mod.key] !== null
            ? { ...nextPermissions[mod.key] }
            : {};

        mod.subModules.forEach((sub) => {
          delete nextPermissions[`${mod.key}.${sub.key}`];
          delete nextPermissions[sub.key];

          const cur = getPermObj(mod.key, sub.key);
          const updatedSub = { ...cur, [permKey]: targetValue };
          if (permKey === 'allView' && targetValue) updatedSub.ownView = true;
          else if (permKey === 'ownView' && !targetValue) updatedSub.allView = false;
          parentObj[sub.key] = updatedSub;
        });
        nextPermissions[mod.key] = parentObj;
      } else {
        const cur = getPermObj(mod.key);
        const updatedMod = { ...cur, [permKey]: targetValue };
        if (permKey === 'allView' && targetValue) updatedMod.ownView = true;
        else if (permKey === 'ownView' && !targetValue) updatedMod.allView = false;
        nextPermissions[mod.key] = updatedMod;
      }
    });

    onChange(nextPermissions);
  };

  // Quick Preset Actions
  const handleApplyPreset = (presetType) => {
    if (isReadOnly) return;
    const nextPermissions = {};

    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        const parentObj = {};
        mod.subModules.forEach((sub) => {
          let state = { add: false, edit: false, delete: false, allView: false, ownView: false };
          if (presetType === 'full') {
            state = { add: true, edit: true, delete: true, allView: true, ownView: true };
          } else if (presetType === 'viewOnly') {
            state = { add: false, edit: false, delete: false, allView: true, ownView: true };
          } else if (presetType === 'standard') {
            const isSystem = mod.category === 'System';
            state = { add: !isSystem, edit: !isSystem, delete: false, allView: true, ownView: true };
          }
          parentObj[sub.key] = state;
        });
        nextPermissions[mod.key] = parentObj;
      } else {
        let state = { add: false, edit: false, delete: false, allView: false, ownView: false };
        if (presetType === 'full') {
          state = { add: true, edit: true, delete: true, allView: true, ownView: true };
        } else if (presetType === 'viewOnly') {
          state = { add: false, edit: false, delete: false, allView: true, ownView: true };
        } else if (presetType === 'standard') {
          const isSystem = mod.category === 'System';
          state = { add: !isSystem, edit: !isSystem, delete: false, allView: true, ownView: true };
        }
        nextPermissions[mod.key] = state;
      }
    });

    onChange(nextPermissions);
  };

  // Calculate if ALL permissions across ALL modules/sub-modules are checked
  let isAllGlobalMasterChecked = true;
  let isSomeGlobalMasterChecked = false;

  MODULE_TREE.forEach((mod) => {
    if (mod.subModules && mod.subModules.length > 0) {
      mod.subModules.forEach((sub) => {
        const p = getPermObj(mod.key, sub.key);
        const allChecked = PERMISSION_COLUMNS.every((col) => p[col.key]);
        const someChecked = PERMISSION_COLUMNS.some((col) => p[col.key]);
        if (!allChecked) isAllGlobalMasterChecked = false;
        if (someChecked) isSomeGlobalMasterChecked = true;
      });
    } else {
      const p = getPermObj(mod.key);
      const allChecked = PERMISSION_COLUMNS.every((col) => p[col.key]);
      const someChecked = PERMISSION_COLUMNS.some((col) => p[col.key]);
      if (!allChecked) isAllGlobalMasterChecked = false;
      if (someChecked) isSomeGlobalMasterChecked = true;
    }
  });

  const handleToggleGlobalMaster = () => {
    if (isReadOnly) return;
    const targetValue = !isAllGlobalMasterChecked;
    const targetState = {
      add: targetValue,
      edit: targetValue,
      delete: targetValue,
      allView: targetValue,
      ownView: targetValue,
    };

    const nextPermissions = {};
    MODULE_TREE.forEach((mod) => {
      if (mod.subModules && mod.subModules.length > 0) {
        const parentObj = {};
        mod.subModules.forEach((sub) => {
          parentObj[sub.key] = { ...targetState };
        });
        nextPermissions[mod.key] = parentObj;
      } else {
        nextPermissions[mod.key] = { ...targetState };
      }
    });

    onChange(nextPermissions);
  };

  // Categories list
  const categories = ['All', ...new Set(MODULE_TREE.map((m) => m.category))];

  // Filter modules
  const filteredModules = MODULE_TREE.filter((mod) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesParent =
      mod.name.toLowerCase().includes(searchLower) ||
      mod.key.toLowerCase().includes(searchLower) ||
      mod.description.toLowerCase().includes(searchLower);

    const matchesSub = mod.subModules?.some(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.key.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
    );

    const matchesCat = selectedCategory === 'All' || mod.category === selectedCategory;
    return (matchesParent || matchesSub) && matchesCat;
  });

  // Calculate total checked permissions and action breakdown
  let totalChecked = 0;
  let maxPossible = 0;
  const actionCounts = { add: 0, edit: 0, delete: 0, allView: 0, ownView: 0 };

  MODULE_TREE.forEach((mod) => {
    if (mod.subModules && mod.subModules.length > 0) {
      mod.subModules.forEach((sub) => {
        maxPossible += PERMISSION_COLUMNS.length;
        const p = getPermObj(mod.key, sub.key);
        PERMISSION_COLUMNS.forEach((col) => {
          if (p[col.key]) {
            totalChecked++;
            actionCounts[col.key]++;
          }
        });
      });
    } else {
      maxPossible += PERMISSION_COLUMNS.length;
      const p = getPermObj(mod.key);
      PERMISSION_COLUMNS.forEach((col) => {
        if (p[col.key]) {
          totalChecked++;
          actionCounts[col.key]++;
        }
      });
    }
  });

  const percentageGranted = Math.round((totalChecked / (maxPossible || 1)) * 100);
  const isAllExpanded = MODULE_TREE.filter((m) => m.subModules).every((m) => expanded[m.key]);

  return (
    <div className={`space-y-4 font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Top Header & Presets Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SecurityIcon className="text-blue-500" sx={{ fontSize: 22 }} />
            <h2 className="text-base font-bold">Module Permission Matrix</h2>
            <Chip
              label={`${totalChecked} / ${maxPossible} True (${percentageGranted}%)`}
              size="small"
              color={totalChecked === maxPossible ? 'success' : totalChecked > 0 ? 'primary' : 'default'}
              variant="outlined"
              className="font-extrabold text-xs"
            />
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage access controls for all modules and sub-modules. Click arrow icons to expand/collapse module groups.
          </p>

          {/* Action-wise Breakdown Summary Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Breakdown:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Add: {actionCounts.add}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Edit: {actionCounts.edit}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Delete: {actionCounts.delete}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              All View: {actionCounts.allView}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Own View: {actionCounts.ownView}
            </span>
          </div>
        </div>

        {/* Quick Action Presets */}
        {!isReadOnly && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => handleExpandAll(!isAllExpanded)}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isAllExpanded ? <UnfoldLessIcon sx={{ fontSize: 16 }} /> : <UnfoldMoreIcon sx={{ fontSize: 16 }} />}
              {isAllExpanded ? 'Collapse All' : 'Expand All'}
            </button>
            <button
              onClick={() => handleApplyPreset('full')}
              className="px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500 shadow-2xs cursor-pointer"
            >
              <SelectAllIcon sx={{ fontSize: 16 }} />
              Full Access
            </button>
            <button
              onClick={() => handleApplyPreset('viewOnly')}
              className="px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all bg-blue-600 text-white hover:bg-blue-700 border-blue-500 shadow-2xs cursor-pointer"
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
              View Only
            </button>
            <button
              onClick={() => handleApplyPreset('standard')}
              className="px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all bg-amber-600 text-white hover:bg-amber-700 border-amber-500 shadow-2xs cursor-pointer"
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
              Standard
            </button>
            <button
              onClick={() => handleApplyPreset('clear')}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-rose-600 hover:bg-slate-200'
              }`}
            >
              <ClearAllIcon sx={{ fontSize: 16 }} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="w-full sm:w-72">
          <TextField
            placeholder="Search module name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={isDark ? 'text-slate-400' : 'text-slate-500'} sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                color: isDark ? '#f8fafc' : '#0f172a',
                '& fieldset': {
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                },
              },
            }}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Permission Table */}
      <div
        className={`overflow-x-auto rounded-xl border shadow-xs ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
              }`}
            >
              <th className="py-3 px-4 font-bold min-w-[280px]">
                <div className="flex items-center justify-between">
                  <span>Module & Sub-module Structure</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                    {filteredModules.length} Parent Modules
                  </span>
                </div>
              </th>
              <th className="py-3 px-3 text-center font-bold min-w-[100px]">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span>Row All</span>
                  {!isReadOnly && (
                    <Tooltip title="Toggle ALL permissions across ALL modules & sub-modules">
                      <Checkbox
                        checked={isAllGlobalMasterChecked}
                        indeterminate={isSomeGlobalMasterChecked && !isAllGlobalMasterChecked}
                        onChange={handleToggleGlobalMaster}
                        size="small"
                        sx={{
                          color: isDark ? '#475569' : '#94a3b8',
                          '&.Mui-checked': { color: '#2563eb' },
                          padding: 0,
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              </th>
              {PERMISSION_COLUMNS.map((col) => {
                return (
                  <th key={col.key} className="py-3 px-3 text-center font-bold min-w-[100px]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${col.badge}`}>
                        {col.label}
                      </span>
                      {!isReadOnly && (
                        <button
                          onClick={() => handleToggleGlobalColumn(col.key)}
                          className={`text-[10px] font-medium underline cursor-pointer hover:opacity-80 ${
                            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title={`Toggle ${col.label} across all modules`}
                        >
                          Select All
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200/80'}`}>
            {filteredModules.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <HighlightOffIcon className="text-slate-400" sx={{ fontSize: 32 }} />
                    <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      No matching modules found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredModules.map((mod) => {
                const IconComponent = mod.icon;
                const hasSub = mod.subModules && mod.subModules.length > 0;
                const isExpanded = expanded[mod.key];

                if (hasSub) {
                  // Count permissions for Parent Module
                  const subMods = mod.subModules;
                  const isAllMasterChecked = subMods.every((sub) => {
                    const p = getPermObj(mod.key, sub.key);
                    return PERMISSION_COLUMNS.every((col) => p[col.key]);
                  });
                  const isSomeMasterChecked = subMods.some((sub) => {
                    const p = getPermObj(mod.key, sub.key);
                    return PERMISSION_COLUMNS.some((col) => p[col.key]);
                  });

                  return (
                    <React.Fragment key={mod.key}>
                      {/* Parent Group Header Row */}
                      <tr
                        className={`transition-colors border-t border-slate-300 dark:border-slate-800 ${
                          isDark ? 'bg-slate-950/70 hover:bg-slate-950' : 'bg-slate-100/90 hover:bg-slate-200/60'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {/* Expand/Collapse Toggle Arrow Button */}
                            <button
                              onClick={() => toggleExpand(mod.key)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isExpanded ? (
                                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                              ) : (
                                <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                              )}
                            </button>

                            <div className={`p-1.5 rounded-md border shadow-2xs ${mod.accentColor}`}>
                              <IconComponent sx={{ fontSize: 18 }} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm">{mod.name}</span>
                                <Chip
                                  label={`${subMods.length} Sub-modules`}
                                  size="small"
                                  className="font-bold text-[10px] h-4"
                                  color="primary"
                                  variant="outlined"
                                />
                              </div>
                              <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {mod.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Master Row Checkbox for Parent Module */}
                        <td className="py-3 px-3 text-center align-middle">
                          <Tooltip title={`Toggle ALL permissions for ${mod.name} and its sub-modules`}>
                            <Checkbox
                              checked={isAllMasterChecked}
                              indeterminate={isSomeMasterChecked && !isAllMasterChecked}
                              onChange={() => handleToggleParentRow(mod)}
                              disabled={isReadOnly}
                              size="small"
                              sx={{
                                color: isDark ? '#475569' : '#94a3b8',
                                '&.Mui-checked': { color: '#2563eb' },
                              }}
                            />
                          </Tooltip>
                        </td>

                        {/* Parent Column Master Checkboxes */}
                        {PERMISSION_COLUMNS.map((col) => {
                          const isAllColChecked = subMods.every((sub) => getPermObj(mod.key, sub.key)[col.key]);
                          const isSomeColChecked = subMods.some((sub) => getPermObj(mod.key, sub.key)[col.key]);

                          return (
                            <td key={col.key} className="py-3 px-3 text-center align-middle">
                              <Tooltip title={`Toggle ${col.label} for all sub-modules of ${mod.name}`}>
                                <Checkbox
                                  checked={isAllColChecked}
                                  indeterminate={isSomeColChecked && !isAllColChecked}
                                  onChange={() => handleToggleParentColumn(mod, col.key)}
                                  disabled={isReadOnly}
                                  size="small"
                                  sx={{
                                    color: isDark ? '#334155' : '#cbd5e1',
                                    '&.Mui-checked': {
                                      color:
                                        col.key === 'add'
                                          ? '#10b981'
                                          : col.key === 'edit'
                                          ? '#3b82f6'
                                          : col.key === 'delete'
                                          ? '#ef4444'
                                          : col.key === 'allView'
                                          ? '#f59e0b'
                                          : '#a855f7',
                                    },
                                  }}
                                />
                              </Tooltip>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Sub-Module Rows (Collapsible) */}
                      {isExpanded &&
                        subMods.map((sub) => {
                          const currentPerm = getPermObj(mod.key, sub.key);
                          const isRowAllChecked = PERMISSION_COLUMNS.every((col) => currentPerm[col.key]);
                          const isRowSomeChecked = PERMISSION_COLUMNS.some((col) => currentPerm[col.key]);

                          return (
                            <tr
                              key={`${mod.key}.${sub.key}`}
                              className={`transition-colors ${
                                isRowAllChecked
                                  ? isDark
                                    ? 'bg-blue-950/20 hover:bg-blue-950/30'
                                    : 'bg-blue-50/40 hover:bg-blue-50/70'
                                  : isDark
                                  ? 'hover:bg-slate-800/40'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              {/* Sub Module Info */}
                              <td className="py-2.5 pl-10 pr-4">
                                <div className="flex items-center gap-2">
                                  <SubdirectoryArrowRightIcon className="text-slate-400" sx={{ fontSize: 18 }} />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs">{sub.name}</span>
                                      <span
                                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                          isDark
                                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                                            : 'bg-slate-100 border-slate-200 text-slate-600'
                                        }`}
                                      >
                                        key: {sub.key}
                                      </span>
                                    </div>
                                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                      {sub.description}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Row Select All Checkbox */}
                              <td className="py-2.5 px-3 text-center align-middle">
                                <Tooltip title={`Toggle all permissions for ${sub.name}`}>
                                  <Checkbox
                                    checked={isRowAllChecked}
                                    indeterminate={isRowSomeChecked && !isRowAllChecked}
                                    onChange={() => {
                                      if (isReadOnly) return;
                                      const targetState = {
                                        add: !isRowAllChecked,
                                        edit: !isRowAllChecked,
                                        delete: !isRowAllChecked,
                                        allView: !isRowAllChecked,
                                        ownView: !isRowAllChecked,
                                      };
                                      const updatedPermissions = { ...permissions };
                                      updatedPermissions[mod.key] = {
                                        ...(updatedPermissions[mod.key] || {}),
                                        [sub.key]: targetState,
                                      };
                                      onChange(updatedPermissions);
                                    }}
                                    disabled={isReadOnly}
                                    size="small"
                                    sx={{
                                      color: isDark ? '#475569' : '#94a3b8',
                                      '&.Mui-checked': { color: '#2563eb' },
                                    }}
                                  />
                                </Tooltip>
                              </td>

                              {/* Permission Action Checkboxes */}
                              {PERMISSION_COLUMNS.map((col) => {
                                const isChecked = Boolean(currentPerm[col.key]);
                                return (
                                  <td key={col.key} className="py-2.5 px-3 text-center align-middle">
                                    <label className="inline-flex items-center justify-center p-1 rounded-md cursor-pointer hover:bg-slate-500/10 transition-colors">
                                      <Checkbox
                                        checked={isChecked}
                                        onChange={() => handleToggleSingle(mod.key, sub.key, col.key)}
                                        disabled={isReadOnly}
                                        size="small"
                                        sx={{
                                          color: isDark ? '#334155' : '#cbd5e1',
                                          '&.Mui-checked': {
                                            color:
                                              col.key === 'add'
                                                ? '#10b981'
                                                : col.key === 'edit'
                                                ? '#3b82f6'
                                                : col.key === 'delete'
                                                ? '#ef4444'
                                                : col.key === 'allView'
                                                ? '#f59e0b'
                                                : '#a855f7',
                                          },
                                        }}
                                      />
                                    </label>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                }

                // Flat Single Module Row
                const currentPerm = getPermObj(mod.key);
                const isRowAllChecked = PERMISSION_COLUMNS.every((col) => currentPerm[col.key]);
                const isRowSomeChecked = PERMISSION_COLUMNS.some((col) => currentPerm[col.key]);

                return (
                  <tr
                    key={mod.key}
                    className={`transition-colors ${
                      isRowAllChecked
                        ? isDark
                          ? 'bg-blue-950/20 hover:bg-blue-950/30'
                          : 'bg-blue-50/40 hover:bg-blue-50/70'
                        : isDark
                        ? 'hover:bg-slate-800/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Module Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border mt-0.5 shadow-2xs ${mod.accentColor}`}>
                          <IconComponent sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm">{mod.name}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                isDark
                                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                                  : 'bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              key: {mod.key}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {mod.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Row Select All Checkbox */}
                    <td className="py-3 px-3 text-center align-middle">
                      <Tooltip title={`Toggle all permissions for ${mod.name}`}>
                        <Checkbox
                          checked={isRowAllChecked}
                          indeterminate={isRowSomeChecked && !isRowAllChecked}
                          onChange={() => handleToggleFlatRow(mod.key)}
                          disabled={isReadOnly}
                          size="small"
                          sx={{
                            color: isDark ? '#475569' : '#94a3b8',
                            '&.Mui-checked': { color: '#2563eb' },
                          }}
                        />
                      </Tooltip>
                    </td>

                    {/* Permission Action Checkboxes */}
                    {PERMISSION_COLUMNS.map((col) => {
                      const isChecked = Boolean(currentPerm[col.key]);
                      return (
                        <td key={col.key} className="py-3 px-3 text-center align-middle">
                          <label className="inline-flex items-center justify-center p-1 rounded-md cursor-pointer hover:bg-slate-500/10 transition-colors">
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleToggleSingle(mod.key, null, col.key)}
                              disabled={isReadOnly}
                              size="small"
                              sx={{
                                color: isDark ? '#334155' : '#cbd5e1',
                                '&.Mui-checked': {
                                  color:
                                    col.key === 'add'
                                      ? '#10b981'
                                      : col.key === 'edit'
                                      ? '#3b82f6'
                                      : col.key === 'delete'
                                      ? '#ef4444'
                                      : col.key === 'allView'
                                      ? '#f59e0b'
                                      : '#a855f7',
                                },
                              }}
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div
        className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Collapsible Module & Sub-module Tree Matrix</span>
        </div>
        <div className="font-mono text-[11px]">
          API JSON format: <code>&#123; "task": &#123; "taskAll": &#123; "add": true &#125; &#125; &#125;</code>
        </div>
      </div>
    </div>
  );
}

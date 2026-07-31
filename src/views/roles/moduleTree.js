import DashboardIcon from '@mui/icons-material/Dashboard';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import RssFeedIcon from '@mui/icons-material/RssFeed';

export const DEFAULT_ACTIONS = ['add', 'edit', 'delete', 'allView', 'ownView'];

export const MODULE_TREE = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    category: 'General',
    description: 'Dashboard metrics and overview statistics',
    icon: DashboardIcon,
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    actions: ['allView', 'ownView'],
  },
  {
    key: 'employee',
    name: 'Employees & Staff',
    category: 'HR & Personnel',
    description: 'Employee profiles, credentials, identity, and staff directory',
    icon: BadgeIcon,
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    subModules: [
      { key: 'allEmployee', name: 'All Employee', description: 'Full employee directory and staff profiles', actions: ['add', 'edit', 'delete', 'allView', 'ownView'] },
      { key: 'myTeam', name: 'My Team', description: 'Direct team members and reporting structure', actions: ['allView', 'ownView'] },
    ],
  },
  {
    key: 'customer',
    name: 'Customer',
    category: 'Customer',
    description: 'Customer profiles, credentials, identity, and staff directory',
    icon: BadgeIcon,
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'task',
    name: 'Tasks & Delegation',
    category: 'Operations',
    description: 'Task creation, status tracking, customer & onboarding tasks',
    icon: AssignmentIcon,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    subModules: [
      { key: 'taskAll', name: 'Task All', description: 'All company tasks and assignments', actions: ['add', 'edit', 'delete', 'allView', 'ownView'] },
      { key: 'teamTask', name: 'Team Task', description: 'Tasks delegated to team members', actions: ['delete', 'allView', 'ownView'] },
      { key: 'taskCustomer', name: 'Task Customer', description: 'Customer related tasks and support items', actions: ['delete', 'allView', 'ownView'] },
      { key: 'onboardingTask', name: 'Onboarding Task', description: 'Onboarding workflows for users and clients', actions: ['edit', 'delete', 'allView', 'ownView'] },
      { key: 'deletedTasks', name: 'Deleted Tasks', description: 'Archived and deleted task records', actions: ['delete', 'allView', 'ownView'] },
    ],
  },

  {
    key: 'tasktype',
    name: 'Task Types ',
    category: 'Operations',
    description: 'Task type settings',
    icon: AssignmentIcon,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView']
  },
  {
    key: 'location',
    name: 'Location',
    category: 'Operations',
    description: 'Location settings',
    icon: AssignmentIcon,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    subModules: [
      { key: 'state', name: 'State', description: 'State settings', actions: ['add', 'edit', 'delete', 'allView', 'ownView'] },
      { key: 'region', name: 'Region', description: 'Region settings', actions: ['add', 'edit', 'delete', 'allView', 'ownView'] },
      { key: 'branch', name: 'Branch', description: 'Branch settings', actions: ['add', 'edit', 'delete', 'allView', 'ownView'] },
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
      { key: 'attendanceDetails', name: 'Attendance Details', description: 'Daily attendance clock-in logs and status', actions: ['add', 'edit', 'allView', 'ownView'] },
      { key: 'monthlyAttendance', name: 'Monthly Attendance', description: 'Monthly summary reports and working hours', actions: ['allView', 'ownView'] },
    ],
  },
  {
    key: 'role',
    name: 'Roles & Permissions',
    category: 'System',
    description: 'User access levels, role definition, and permission matrix',
    icon: SecurityIcon,
    accentColor: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'admin',
    name: 'Admin Panel',
    category: 'System',
    description: 'System administration and controls',
    icon: AdminPanelSettingsIcon,
    accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'department',
    name: 'Department',
    category: 'Organization',
    description: 'Company departments and business units',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'designation',
    name: 'Designation',
    category: 'Organization',
    description: 'Employee job titles and designations',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'branch',
    name: 'Branch Offices',
    category: 'Organization',
    description: 'Office branches and locations',
    icon: BusinessIcon,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'leave',
    name: 'Leave Management',
    category: 'HR & Personnel',
    description: 'Leave applications and approvals',
    icon: HowToRegIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'holiday',
    name: 'Holidays',
    category: 'HR & Personnel',
    description: 'Company holiday calendar',
    icon: HowToRegIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'feeds',
    name: 'Feeds & Announcements',
    category: 'Communication',
    description: 'Company announcements and posts',
    icon: RssFeedIcon,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    actions: ['add', 'edit', 'delete', 'allView', 'ownView'],
  },
  {
    key: 'reports',
    name: 'Reports & Analytics',
    category: 'Analytics',
    description: 'System reports and analytics',
    icon: RssFeedIcon,
    accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
    actions: ['allView', 'ownView'],
  }
];

export const sortPermissionsByModuleTree = (permissions) => {
  if (!permissions || typeof permissions !== 'object') return permissions;

  // 1. Normalize flat dot-notation keys (e.g. "employee.allEmployee") into nested structure
  const normalized = {};

  Object.keys(permissions).forEach((key) => {
    const val = permissions[key];
    if (key.includes('.')) {
      const [parentKey, subKey] = key.split('.');
      if (!normalized[parentKey]) {
        normalized[parentKey] = {};
      }
      if (typeof normalized[parentKey] === 'object' && normalized[parentKey] !== null) {
        normalized[parentKey][subKey] = val;
      }
    } else {
      if (normalized[key] && typeof normalized[key] === 'object' && typeof val === 'object' && val !== null) {
        normalized[key] = { ...normalized[key], ...val };
      } else {
        normalized[key] = val;
      }
    }
  });

  // 2. Sort permissions in the exact sequence of MODULE_TREE
  const sortedPerms = {};

  MODULE_TREE.forEach((mod) => {
    if (mod.key in normalized) {
      const val = normalized[mod.key];
      if (val && typeof val === 'object' && mod.subModules && mod.subModules.length > 0) {
        const sortedSub = {};
        mod.subModules.forEach((sub) => {
          if (sub.key in val) {
            sortedSub[sub.key] = val[sub.key];
          }
        });
        Object.keys(val).forEach((subKey) => {
          if (!(subKey in sortedSub)) {
            sortedSub[subKey] = val[subKey];
          }
        });
        sortedPerms[mod.key] = sortedSub;
      } else {
        sortedPerms[mod.key] = val;
      }
    }
  });

  // 3. Append any extra keys not found in MODULE_TREE
  Object.keys(normalized).forEach((key) => {
    if (!(key in sortedPerms)) {
      sortedPerms[key] = normalized[key];
    }
  });

  return sortedPerms;
};


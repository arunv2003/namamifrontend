import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { useThemeMode } from '../../contexts/ThemeContext';

import TablePaginationComponent from '../../components/common/TablePaginationComponent';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';

import { EmployeeRoute } from '../../routes/employee/employee.route.js';

// ==========================================
// 1. ORGANIZATIONAL HIERARCHY TREE CHART
// ==========================================



const TreeNode = ({ node, level = 0, isDark, onNodeClick, expandedNodes, toggleExpand }) => {
  if (!node) return null;

  const getChildrenList = (n) => {
    if (!n) return [];
    if (Array.isArray(n.team) && n.team.length > 0) return n.team;
    if (Array.isArray(n.children) && n.children.length > 0) return n.children;
    if (Array.isArray(n.employees) && n.employees.length > 0) return n.employees;
    if (Array.isArray(n.subordinates) && n.subordinates.length > 0) return n.subordinates;
    return [];
  };

  const children = getChildrenList(node);
  const hasChildren = Array.isArray(children) && children.length > 0;
  const isExpanded = expandedNodes[node.id] !== false; // default expanded

  // Sleek White Card Palette with Top Border Color Accent matching user screenshot
  const getLevelStyles = (lvl) => {
    switch (lvl) {
      case 0:
        // Level 0: Root Manager (Indigo Top Accent)
        return {
          cardClass: isDark
            ? 'bg-slate-900 text-slate-100 border-slate-800 border-t-4 border-t-indigo-500 shadow-md hover:border-indigo-400'
            : 'bg-white text-slate-900 border-slate-200 border-t-4 border-t-indigo-600 shadow-sm hover:shadow-md',
          badgeClass: isDark ? 'bg-indigo-950 text-indigo-300 font-bold' : 'bg-indigo-100 text-indigo-800 font-bold',
          avatarBg: '#4f46e5',
          titleColor: isDark ? 'text-slate-100' : 'text-slate-900',
          subtitleColor: isDark ? 'text-slate-400' : 'text-slate-500',
          connectorColor: 'bg-indigo-500',
          tag: 'Manager',
        };
      case 1:
        // Level 1: Team Leads (Royal Blue Top Accent)
        return {
          cardClass: isDark
            ? 'bg-slate-900 text-slate-100 border-slate-800 border-t-4 border-t-blue-500 shadow-md hover:border-blue-400'
            : 'bg-white text-slate-900 border-slate-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md',
          badgeClass: isDark ? 'bg-blue-950 text-blue-300 font-bold' : 'bg-blue-100 text-blue-800 font-bold',
          avatarBg: '#1e40af',
          titleColor: isDark ? 'text-slate-100' : 'text-slate-900',
          subtitleColor: isDark ? 'text-slate-400' : 'text-slate-500',
          connectorColor: 'bg-blue-500',
          tag: 'Team Lead',
        };
      case 2:
        // Level 2: Employees (Sky Blue Top Accent Card)
        return {
          cardClass: isDark
            ? 'bg-slate-900 text-slate-100 border-slate-800 border-t-4 border-t-sky-400 shadow-md hover:border-sky-400'
            : 'bg-white text-slate-900 border-slate-200 border-t-4 border-t-sky-400 shadow-sm hover:shadow-md',
          badgeClass: isDark ? 'bg-sky-950 text-sky-300 font-bold' : 'bg-sky-100 text-sky-700 font-bold',
          avatarBg: '#0284c7',
          titleColor: isDark ? 'text-slate-100' : 'text-slate-900',
          subtitleColor: isDark ? 'text-slate-400' : 'text-slate-500',
          connectorColor: 'bg-sky-400',
          tag: 'Employee',
        };
      case 3:
        // Level 3: Sub-Employees (Emerald Green Top Accent Card - matching screenshot!)
        return {
          cardClass: isDark
            ? 'bg-slate-900 text-slate-100 border-slate-800 border-t-4 border-t-emerald-400 shadow-md hover:border-emerald-400'
            : 'bg-white text-slate-900 border-slate-200 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md',
          badgeClass: isDark ? 'bg-emerald-950 text-emerald-300 font-bold' : 'bg-emerald-100 text-emerald-700 font-bold',
          avatarBg: '#059669',
          titleColor: isDark ? 'text-slate-100' : 'text-slate-900',
          subtitleColor: isDark ? 'text-slate-400' : 'text-slate-500',
          connectorColor: 'bg-emerald-400',
          tag: 'Employee',
        };
      default:
        // Level 4+: Sub-Teams (Amber Top Accent Card)
        return {
          cardClass: isDark
            ? 'bg-slate-900 text-slate-100 border-slate-800 border-t-4 border-t-amber-400 shadow-md hover:border-amber-400'
            : 'bg-white text-slate-900 border-slate-200 border-t-4 border-t-amber-500 shadow-sm hover:shadow-md',
          badgeClass: isDark ? 'bg-amber-950 text-amber-300 font-bold' : 'bg-amber-100 text-amber-800 font-bold',
          avatarBg: '#d97706',
          titleColor: isDark ? 'text-slate-100' : 'text-slate-900',
          subtitleColor: isDark ? 'text-slate-400' : 'text-slate-500',
          connectorColor: 'bg-amber-400',
          tag: 'Associate',
        };
    }
  };

  const styles = getLevelStyles(level);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Node Box */}
      <div
        onClick={() => onNodeClick && onNodeClick(node)}
        className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer w-36 sm:w-40 group ${styles.cardClass}`}
      >
        {/* Role Badge & Employee ID */}
        <div className="w-full flex items-center justify-between gap-1 mb-1">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${styles.badgeClass}`}>
            {node.role || node.designations || styles.tag}
          </span>
          {(node.emp_id || node.employee_id) && (
            <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-400 truncate">
              #{node.emp_id || node.employee_id}
            </span>
          )}
        </div>

        {/* Avatar & User Details */}
        <div className="flex flex-col items-center text-center gap-0.5 w-full my-0.5">
          <Avatar
            src={node.image || node.avatar}
            alt={node.name}
            sx={{
              width: level === 0 ? 34 : 28,
              height: level === 0 ? 34 : 28,
              bgcolor: styles.avatarBg,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: level === 0 ? '0.9rem' : '0.75rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          >
            {node.name ? node.name.charAt(0).toUpperCase() : 'E'}
          </Avatar>
          <span className={`font-extrabold text-xs line-clamp-1 w-full text-slate-900 dark:text-slate-100`}>
            {node.name || 'Employee'}
          </span>
          {node.department && (
            <span className={`text-[10px] font-medium line-clamp-1 w-full text-slate-400 dark:text-slate-400`}>
              {node.department}
            </span>
          )}
        </div>

        {/* Expand / Collapse Toggle Badge */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
            className="mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-0.5 transition-all cursor-pointer shadow-xs"
          >
            <span>{children.length} {children.length === 1 ? 'Report' : 'Reports'}</span>
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 12 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 12 }} />
            )}
          </button>
        )}
      </div>

      {/* Children Tree Connector & Sub-branches */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center w-full">
          {/* Vertical line coming down from parent node */}
          <div className={`w-0.5 h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

          {/* Children row with connector line */}
          <div className="flex flex-nowrap items-start relative gap-3 sm:gap-4 pt-1.5">
            {/* Horizontal connector line linking across children */}
            {children.length > 1 && (
              <div
                className={`absolute top-0 h-0.5 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                style={{
                  left: `calc(100% / ${children.length * 2})`,
                  right: `calc(100% / ${children.length * 2})`,
                }}
              />
            )}

            {/* Child Nodes */}
            {children.map((child, idx) => (
              <div key={child.id || idx} className="flex flex-col items-center relative">
                {/* Vertical line connecting to child top */}
                <div className={`w-0.5 h-3 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                <TreeNode
                  node={child}
                  level={level + 1}
                  isDark={isDark}
                  onNodeClick={onNodeClick}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function OrgTreeChart() {
  const { isDark } = useThemeMode();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchTeamHierarchy = async () => {
    setLoading(true);
    try {
      const res = await EmployeeRoute.getMyTeam();
      const nodeData = res?.data?.data || res?.data || res;
      if (nodeData && typeof nodeData === 'object' && (nodeData.id || nodeData.name || nodeData.team || nodeData.children)) {
        setTreeData(nodeData);
      } else {
        setTreeData(null);
      }
    } catch (err) {
      console.error('Fetch my team hierarchy error:', err);
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamHierarchy();
  }, []);

  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setDetailModalOpen(true);
  };

  const rootData = treeData;

  return (
    <Paper
      elevation={0}
      className={`w-full flex-1 flex flex-col min-h-0 rounded-2xl border overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200 shadow-sm'
      }`}
    >
      {/* Chart Control Toolbar */}
      <div className={`p-3 border-b flex items-center justify-between gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <Chip
            icon={<GroupsIcon style={{ fontSize: 16 }} />}
            label="Organizational Hierarchy Chart"
            color="primary"
            size="small"
            sx={{ fontWeight: 700, borderRadius: '8px' }}
          />
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} hidden sm:inline`}>
            Interactive dynamic tree chart visualization
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Tooltip title="Zoom In">
            <IconButton
              size="small"
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6))}
              sx={{ color: isDark ? '#cbd5e1' : '#475569' }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <span className={`text-xs font-mono font-bold px-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <Tooltip title="Zoom Out">
            <IconButton
              size="small"
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.5))}
              sx={{ color: isDark ? '#cbd5e1' : '#475569' }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton
              size="small"
              onClick={() => setZoomLevel(1)}
              sx={{ color: isDark ? '#cbd5e1' : '#475569' }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 min-h-0 overflow-auto p-6 sm:p-10 flex justify-center items-start no-scrollbar relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center my-auto gap-3 py-16">
            <CircularProgress size={40} color="primary" />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Building organizational hierarchy chart...
            </span>
          </div>
        ) : !rootData ? (
          <div className="flex flex-col items-center justify-center my-auto gap-3 py-16">
            <GroupsIcon className={isDark ? 'text-slate-600' : 'text-slate-400'} style={{ fontSize: 48 }} />
            <span className={`text-base font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              No team hierarchy found
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Ensure team members have reporting managers assigned.
            </span>
          </div>
        ) : (
          <div
            className="transition-transform duration-200 origin-top flex justify-center min-w-max"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <TreeNode
              node={rootData}
              level={0}
              isDark={isDark}
              onNodeClick={handleNodeClick}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          </div>
        )}
      </div>

      {/* Node Detail Popup Dialog */}
      {selectedNode && (
        <Dialog
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#ffffff' : '#0f172a',
              minWidth: 320,
              maxWidth: 440,
            },
          }}
        >
          <DialogTitle sx={{ p: 2.5, pb: 1, display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <div className="flex items-center gap-3">
              <Avatar
                src={selectedNode.image || selectedNode.avatar}
                alt={selectedNode.name}
                sx={{ width: 44, height: 44, bgcolor: '#2563eb', fontWeight: 700 }}
              >
                {selectedNode.name ? selectedNode.name.charAt(0).toUpperCase() : 'E'}
              </Avatar>
              <div>
                <h3 className="text-base font-extrabold leading-tight">{selectedNode.name}</h3>
                <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                  {selectedNode.role || selectedNode.designations || 'Employee'}
                </p>
              </div>
            </div>
            <IconButton onClick={() => setDetailModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2.5, borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Employee ID:</span>
                <span className="font-mono font-bold">{selectedNode.employee_id || selectedNode.emp_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Department:</span>
                <span className="font-medium">{selectedNode.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Email:</span>
                <span className="font-medium">{selectedNode.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Mobile:</span>
                <span className="font-mono">{selectedNode.mobile || selectedNode.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Status:</span>
                <Chip
                  label={selectedNode.status || 'Active'}
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                />
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-500">Direct Reports:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {Array.isArray(selectedNode.children) ? selectedNode.children.length : 0} members
                </span>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDetailModalOpen(false)} variant="contained" fullWidth sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>
              Close Profile
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}

// ==========================================
// 2. TABULAR MY TEAM TABLE VIEW
// ==========================================

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const cellVal = formatCellText(row.getValue(columnId));
  const itemRank = rankItem(cellVal, value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const columnHelper = createColumnHelper();

const formatCellText = (val, fallback = 'null') => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val)) {
    if (val.length === 0) return fallback;
    return val.map((item) => formatCellText(item, fallback)).join(', ');
  }
  if (typeof val === 'object') {
    return val.name || val.title || val.label || val.slug || val.identity || (val.id ? `ID: ${val.id}` : fallback);
  }
  return String(val);
};

const flattenHierarchy = (rootNode) => {
  if (!rootNode) return [];
  const result = [];
  const visited = new Set();

  const traverse = (node) => {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);

    const { children, team, employees, subordinates, ...rest } = node;
    result.push(rest);

    const subList = (Array.isArray(children) && children.length > 0) ? children
      : (Array.isArray(team) && team.length > 0) ? team
      : (Array.isArray(employees) && employees.length > 0) ? employees
      : (Array.isArray(subordinates) && subordinates.length > 0) ? subordinates : [];

    subList.forEach(traverse);
  };

  traverse(rootNode);
  return result;
};

export default function MyTeamTable({
  searchTerm = '',
  selectedDepartment = 'All',
  selectedStatus = 'All',
  onViewClick,
  onEditClick,
  onDeleteClick,
  getStatusChipProps,
  maxHeight,
  columnVisibility = {},
}) {
  const [sorting, setSorting] = useState([]);
  const { isDark } = useThemeMode();
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getTeamEmployees = async () => {
    setLoading(true);
    try {
      const res = await EmployeeRoute.getMyTeam();
      const nodeData = res?.data?.data || res?.data || res;

      if (nodeData && typeof nodeData === 'object' && (nodeData.id || nodeData.name || nodeData.team || nodeData.children)) {
        const flatList = flattenHierarchy(nodeData);
        setEmployees(flatList);
        setTotalEmployees(flatList.length);
      } else {
        const fallbackRes = await EmployeeRoute.getAllEmployee({
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm || undefined,
          status: selectedStatus !== 'All' ? selectedStatus.toLowerCase() : undefined,
          department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
        });

        if (fallbackRes?.success && fallbackRes?.data?.employees) {
          setEmployees(fallbackRes.data.employees);
          setTotalEmployees(fallbackRes.data.totalItems ?? fallbackRes.data.employees.length);
        } else {
          setEmployees([]);
          setTotalEmployees(0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch team employees:', err);
      setEmployees([]);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeamEmployees();
  }, [page, rowsPerPage, searchTerm, selectedDepartment, selectedStatus]);

  const getChipProps = (status) => {
    if (getStatusChipProps) {
      return getStatusChipProps(status);
    }
    if (isDark) {
      switch (status) {
        case 'Active':
          return {
            label: 'Active',
            style: {
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              fontWeight: 600,
            },
          };
        case 'On Leave':
          return {
            label: 'On Leave',
            style: {
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: '#fde047',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              fontWeight: 600,
            },
          };
        default:
          return {
            label: 'Inactive',
            style: {
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600,
            },
          };
      }
    } else {
      switch (status) {
        case 'Active':
          return {
            label: 'Active',
            style: {
              backgroundColor: '#dcfce7',
              color: '#14532d',
              border: '1px solid #86efac',
              fontWeight: 700,
            },
          };
        case 'On Leave':
          return {
            label: 'On Leave',
            style: {
              backgroundColor: '#fef9c3',
              color: '#713f12',
              border: '1px solid #fde047',
              fontWeight: 700,
            },
          };
        default:
          return {
            label: 'Inactive',
            style: {
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              border: '1px solid #fca5a5',
              fontWeight: 700,
            },
          };
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const name = formatCellText(row.original.name);
          const email = formatCellText(row.original.email);
          const img = typeof row.original.image === 'string' && row.original.image !== 'default.png' ? row.original.image : row.original.avatar;
          return (
            <div className="flex items-center gap-3 min-w-[180px]">
              <Avatar
                src={img}
                alt={name}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: isDark ? '#3b82f6' : '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className={`font-semibold text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {name}
                </span>
                <span className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {email}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('manager', {
        id: 'manager',
        header: 'Manager',
        cell: ({ row }) => {
          const mgr = row.original.manager || row.original.manager_id;
          let mgrName = 'N/A';
          if (typeof mgr === 'object' && mgr !== null && mgr.name) {
            mgrName = mgr.name;
          } else if (typeof mgr === 'string') {
            mgrName = mgr;
          } else if (row.original.manager_name) {
            mgrName = row.original.manager_name;
          }
          return (
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {mgrName}
            </span>
          );
        },
      }),
      columnHelper.accessor('emp_id', {
        id: 'emp_id',
        header: 'Id',
        cell: ({ row }) => {
          const empId = row.original.emp_id || row.original.employee_id || row.original.identity || 'N/A';
          return (
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {empId}
            </span>
          );
        },
      }),
      columnHelper.accessor('department', {
        id: 'department',
        header: 'Department',
        cell: ({ getValue }) => (
          <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {formatCellText(getValue(), 'N/A')}
          </span>
        ),
      }),
      columnHelper.accessor('designations', {
        id: 'designations',
        header: 'Designations',
        cell: ({ row }) => {
          const desig = row.original.designations || row.original.role || 'Employee';
          return (
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {desig}
            </span>
          );
        },
      }),
      columnHelper.accessor('mobile', {
        id: 'mobile',
        header: 'Mobile',
        cell: ({ row }) => {
          const mob = row.original.mobile || row.original.phone || 'N/A';
          return (
            <span className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {mob}
            </span>
          );
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const rawStatus = formatCellText(getValue(), 'Active');
          const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
          const chipProps = getChipProps(formattedStatus);
          return (
            <Chip
              label={chipProps.label}
              size="small"
              style={{
                ...chipProps.style,
                fontSize: '0.72rem',
                height: '22px',
                borderRadius: '6px',
              }}
            />
          );
        },
      }),
      columnHelper.accessor('location', {
        id: 'location',
        header: 'Work Location',
        cell: ({ getValue }) => (
          <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {formatCellText(getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right w-full pr-2">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {/* {onViewClick && (
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onViewClick(row.original)}
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    '&:hover': { color: isDark ? '#60a5fa' : '#2563eb', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.08)' },
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )} */}
            {onEditClick && (
              <Tooltip title="Edit Member">
                <IconButton
                  size="small"
                  onClick={() => onEditClick(row.original)}
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    '&:hover': { color: isDark ? '#34d399' : '#059669', backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.08)' },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDeleteClick && (
              <Tooltip title="Delete Member">
                <IconButton
                  size="small"
                  onClick={() => onDeleteClick(row.original)}
                  sx={{
                    color: isDark ? '#f87171' : '#dc2626',
                    '&:hover': { color: isDark ? '#ef4444' : '#b91c1c', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.08)' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ),
      }),
    ],
    [isDark, onViewClick, onEditClick, onDeleteClick]
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter: searchTerm,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
  });

  const currentPageRows = table.getRowModel().rows;

  return (
    <Paper
      elevation={0}
      className={`w-full flex-1 flex flex-col min-h-0 rounded-2xl border overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <TableContainer
        className="flex-1 overflow-auto no-scrollbar"
        style={{ maxHeight: maxHeight || 'calc(100vh - 220px)' }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableCell
                      key={header.id}
                      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                      sx={{
                        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                        color: isDark ? '#94a3b8' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1.5,
                        borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                        cursor: isSortable ? 'pointer' : 'default',
                        userSelect: 'none',
                        '&:hover': isSortable
                          ? { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }
                          : {},
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          <span className="inline-flex items-center">
                            {sortDir === 'asc' && <ArrowUpwardIcon sx={{ fontSize: 14 }} />}
                            {sortDir === 'desc' && <ArrowDownwardIcon sx={{ fontSize: 14 }} />}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading team data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <div className="flex flex-col items-center gap-2">
                    <GroupsIcon className={isDark ? 'text-slate-600' : 'text-slate-400'} style={{ fontSize: 48 }} />
                    <p className={`font-semibold text-base ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      No team members matching your criteria
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Try adjusting your search query or status filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentPageRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                    },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} align={cell.column.id === 'actions' ? 'right' : 'left'} sx={{ px: 1.5, py: 1.5 }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <div className={`flex-shrink-0 border-t ${isDark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
        <TablePaginationComponent
          table={table}
          totalData={totalEmployees}
          page={page}
          setPage={(newPage) => setPage(newPage)}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 25, 50]}
        />
      </div>
    </Paper>
  );
}


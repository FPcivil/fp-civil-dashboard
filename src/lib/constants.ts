export const PROJECT_STATUSES = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CLOSED: "Closed",
} as const;

export const TASK_STATUSES = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  ON_HOLD: "On Hold",
} as const;

export const PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
} as const;

export const CATEGORIES = {
  STRUCTURAL: "Structural",
  ELECTRICAL: "Electrical",
  PLUMBING: "Plumbing",
  HVAC: "HVAC",
  GENERAL: "General",
  SAFETY: "Safety",
  COMPLIANCE: "Compliance",
} as const;

export const RFI_STATUSES = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  CLARIFICATION_NEEDED: "Clarification Needed",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const VARIATION_STATUSES = {
  PROPOSED: "Proposed",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  IMPLEMENTED: "Implemented",
} as const;

export const ISSUE_STATUSES = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
} as const;

export const STATUS_COLORS = {
  // Project statuses
  Planning: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  "On Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Completed: "bg-slate-100 text-slate-800 border-slate-200",
  Closed: "bg-slate-100 text-slate-800 border-slate-200",
  // Task statuses
  "Not Started": "bg-slate-100 text-slate-800 border-slate-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Blocked: "bg-red-100 text-red-800 border-red-200",
  // RFI statuses
  Submitted: "bg-blue-100 text-blue-800 border-blue-200",
  "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Clarification Needed": "bg-orange-100 text-orange-800 border-orange-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
  // Variation statuses
  Proposed: "bg-blue-100 text-blue-800 border-blue-200",
  Implemented: "bg-green-100 text-green-800 border-green-200",
  // Issue statuses
  Open: "bg-red-100 text-red-800 border-red-200",
  Resolved: "bg-green-100 text-green-800 border-green-200",
} as const;

export const PRIORITY_COLORS = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
} as const;

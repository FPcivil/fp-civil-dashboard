// Status options for dropdowns
export const PROJECT_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  { value: "on_hold", label: "On Hold", color: "bg-yellow-100 text-yellow-700" },
  { value: "complete", label: "Complete", color: "bg-blue-100 text-blue-700" },
] as const;

export const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-700" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
  { value: "in_review", label: "In Review", color: "bg-purple-100 text-purple-700" },
  { value: "done", label: "Done", color: "bg-green-100 text-green-700" },
  { value: "blocked", label: "Blocked", color: "bg-red-100 text-red-700" },
] as const;

export const VARIATION_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-700" },
  { value: "under_review", label: "Under Review", color: "bg-yellow-100 text-yellow-700" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
] as const;

export const RFI_STATUSES = [
  { value: "open", label: "Open", color: "bg-yellow-100 text-yellow-700" },
  { value: "responded", label: "Responded", color: "bg-blue-100 text-blue-700" },
  { value: "closed", label: "Closed", color: "bg-green-100 text-green-700" },
] as const;

export const ISSUE_STATUSES = [
  { value: "open", label: "Open", color: "bg-red-100 text-red-700" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  { value: "resolved", label: "Resolved", color: "bg-blue-100 text-blue-700" },
  { value: "closed", label: "Closed", color: "bg-green-100 text-green-700" },
] as const;

export const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-600" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" },
] as const;

export const ISSUE_CATEGORIES = [
  { value: "defect", label: "Defect" },
  { value: "safety", label: "Safety" },
  { value: "blocker", label: "Blocker" },
  { value: "delay", label: "Delay" },
  { value: "other", label: "Other" },
] as const;

export const TRUDE_TYPES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "carpentry", label: "Carpentry" },
  { value: "concrete", label: "Concrete" },
  { value: "excavation", label: "Excavation" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
  { value: "landscaping", label: "Landscaping" },
  { value: "demolition", label: "Demolition" },
  { value: "steelwork", label: "Steelwork" },
  { value: "tiling", label: "Tiling" },
  { value: "waterproofing", label: "Waterproofing" },
  { value: "other", label: "Other" },
] as const;

export const WEATHER_OPTIONS = [
  { value: "fine", label: "Fine", icon: "Sun" },
  { value: "overcast", label: "Overcast", icon: "Cloud" },
  { value: "rain", label: "Rain", icon: "CloudRain" },
  { value: "storm", label: "Storm", icon: "CloudLightning" },
  { value: "wind", label: "Wind", icon: "Wind" },
] as const;

export const USER_ROLES = [
  { value: "director", label: "Director" },
  { value: "project_manager", label: "Project Manager" },
  { value: "supervisor", label: "Supervisor" },
  { value: "admin", label: "Admin" },
] as const;

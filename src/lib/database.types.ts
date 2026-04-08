// Generated types matching the Supabase schema
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type UserRole = "director" | "project_manager" | "supervisor" | "admin";
export type ProjectStatus = "draft" | "active" | "on_hold" | "complete";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done" | "blocked";
export type VariationStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";
export type RfiStatus = "open" | "responded" | "closed";
export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";
export type IssueCategory = "defect" | "safety" | "blocker" | "delay" | "other";

export interface DashboardKpis {
  id: string;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  overdue_tasks: number;
  total_tasks: number;
  role: UserRole;
}

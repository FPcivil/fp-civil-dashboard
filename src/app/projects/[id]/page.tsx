"use client";

import { useParams } from "next/navigation";
import { useProjectById, useTableData } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, formatDateShort } from "@/lib/utils";
import {
  CheckSquare,
  AlertCircle,
  HelpCircle,
  GitBranch,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { project, isLoading: projectLoading } = useProjectById(projectId);
  const { data: tasks } = useTableData("tasks", { project_id: projectId });
  const { data: issues } = useTableData("issues", { project_id: projectId });
  const { data: rfis } = useTableData("rfis", { project_id: projectId });
  const { data: variations } = useTableData("variations", { project_id: projectId });

  if (projectLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you're looking for does not exist"
        action={
          <Link
            href="/projects"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </Link>
        }
      />
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const openIssues = issues.filter((i) => i.status === "Open").length;
  const pendingRfis = rfis.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description || undefined}
        actions={
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Projects
          </Link>
        }
      />

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Project Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 font-medium">Client</p>
                <p className="text-slate-900">{project.client || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Status</p>
                <StatusBadge status={project.status} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Start Date</p>
                <p className="text-slate-900">
                  {project.start_date ? formatDateShort(project.start_date) : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">End Date</p>
                <p className="text-slate-900">
                  {project.end_date ? formatDateShort(project.end_date) : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Budget</p>
                <p className="text-slate-900">
                  {project.budget ? `$${project.budget.toFixed(2)}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 font-medium mb-2">Tasks Progress</p>
            <ProgressBar percentage={taskProgress} />
            <p className="text-xs text-slate-600 mt-2">
              {completedTasks} of {tasks.length} completed
            </p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 font-medium mb-3">Quick Stats</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Open Issues</span>
                <span className="font-semibold text-red-600">{openIssues}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending RFIs</span>
                <span className="font-semibold text-yellow-600">{pendingRfis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Variations</span>
                <span className="font-semibold text-blue-600">{variations.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <CheckSquare size={20} />
              Tasks
            </h3>
            <Link
              href="/tasks"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {tasks.length === 0 ? (
            <EmptyState title="No tasks" />
          ) : (
            <div className="divide-y divide-slate-200">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={task.status} />
                    <span className="text-xs text-slate-600">
                      Due: {task.due_date ? formatDateShort(task.due_date) : "No date"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issues */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle size={20} />
              Issues
            </h3>
            <Link
              href="/issues"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {issues.length === 0 ? (
            <EmptyState title="No issues" />
          ) : (
            <div className="divide-y divide-slate-200">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{issue.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={issue.status} />
                    <span className="text-xs text-slate-600">
                      Priority: {issue.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RFIs */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <HelpCircle size={20} />
              RFIs
            </h3>
            <Link
              href="/rfis"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {rfis.length === 0 ? (
            <EmptyState title="No RFIs" />
          ) : (
            <div className="divide-y divide-slate-200">
              {rfis.slice(0, 5).map((rfi) => (
                <div key={rfi.id} className="p-4 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{rfi.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={rfi.status} />
                    <span className="text-xs text-slate-600">
                      {rfi.submitted_date ? formatDateShort(rfi.submitted_date) : "No date"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variations */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <GitBranch size={20} />
              Variations
            </h3>
            <Link
              href="/variations"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {variations.length === 0 ? (
            <EmptyState title="No variations" />
          ) : (
            <div className="divide-y divide-slate-200">
              {variations.slice(0, 5).map((variation) => (
                <div key={variation.id} className="p-4 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{variation.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={variation.status} />
                    {variation.cost_impact && (
                      <span className="text-xs text-slate-600">
                        Cost: ${variation.cost_impact.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

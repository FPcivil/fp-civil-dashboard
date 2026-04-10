"use client";

import { useState } from "react";
import { useDashboardKpis, useProjectSummaries } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import {
  FolderOpen,
  CheckSquare,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

export default function DashboardPage() {
  const { kpis, isLoading: kpisLoading } = useDashboardKpis();
  const { projects, isLoading: projectsLoading } = useProjectSummaries();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to F&P Civil project management dashboard"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Projects"
          value={kpis?.total_projects ?? 0}
          icon={<FolderOpen size={24} className="text-blue-600" />}
          color="blue"
        />
        <KpiCard
          title="Active Projects"
          value={kpis?.active_projects ?? 0}
          icon={<FolderOpen size={24} className="text-green-600" />}
          color="green"
        />
        <KpiCard
          title="Tasks Completed"
          value={kpis?.completed_tasks ?? 0}
          unit={`/ ${kpis?.total_tasks ?? 0}`}
          icon={<CheckSquare size={24} className="text-blue-600" />}
          color="blue"
        />
        <KpiCard
          title="Open Issues"
          value={kpis?.open_issues ?? 0}
          icon={<AlertCircle size={24} className="text-red-600" />}
          color="red"
        />
      </div>

      {/* Projects Summary */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Active Projects</h2>
        </div>

        {projectsLoading ? (
          <div className="p-6 text-center">
            <p className="text-slate-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderOpen size={48} className="text-slate-400" />}
            title="No projects yet"
            description="Create your first project to get started"
            action={
              <Link
                href="/projects"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Projects
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Project Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Client
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Progress
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Dates
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {project.client || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status || "Unknown"} />
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBar
                        percentage={project.progress ?? 0}
                        size="sm"
                        showLabel
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {project.start_date && (
                        <>
                          {formatDateShort(project.start_date)}
                          {project.end_date && (
                            <>
                              <br />
                              to {formatDateShort(project.end_date)}
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {project.open_issues && project.open_issues > 0 && (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            {project.open_issues}
                          </span>
                        )}
                        {project.pending_rfis && project.pending_rfis > 0 && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            {project.pending_rfis} RFI
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

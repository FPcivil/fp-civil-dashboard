"use client";

import { useState } from "react";
import { useProjectSummaries, insertRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Modal } from "@/components/Modal";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { EmptyState } from "@/components/EmptyState";
import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";
import { PROJECT_STATUSES } from "@/lib/constants";

const statusOptions = Object.entries(PROJECT_STATUSES).map(([, value]) => ({
  value,
  label: value,
}));

export default function ProjectsPage() {
  const { projects, isLoading } = useProjectSummaries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    status: "Planning",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("projects", {
        name: formData.name,
        client: formData.client || null,
        description: formData.description || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      });

      setFormData({
        name: "",
        client: "",
        description: "",
        status: "Planning",
        start_date: "",
        end_date: "",
        budget: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage all construction projects"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Project
          </button>
        }
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={48} className="text-slate-400" />}
          title="No projects yet"
          description="Create your first project to get started"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
                    Start Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    End Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Tasks
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
                      {project.start_date ? formatDateShort(project.start_date) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {project.end_date ? formatDateShort(project.end_date) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {project.completed_tasks ?? 0} / {project.total_tasks ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Add a new construction project to the dashboard"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Project Name" required>
            <Input
              type="text"
              placeholder="Project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Client">
            <Input
              type="text"
              placeholder="Client name"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            />
          </FormField>

          <FormField label="Status">
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Project description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </FormField>
            <FormField label="End Date">
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Budget">
            <Input
              type="number"
              placeholder="Budget amount"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              step="0.01"
            />
          </FormField>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

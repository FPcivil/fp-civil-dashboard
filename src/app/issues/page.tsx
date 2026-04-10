"use client";

import { useState } from "react";
import { useTableData, insertRow, updateRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityDot } from "@/components/PriorityDot";
import { Modal } from "@/components/Modal";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { EmptyState } from "@/components/EmptyState";
import { AlertCircle, Plus } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { ISSUE_STATUSES, PRIORITIES } from "@/lib/constants";

const statusOptions = Object.entries(ISSUE_STATUSES).map(([, value]) => ({
  value,
  label: value,
}));

const priorityOptions = Object.entries(PRIORITIES).map(([, value]) => ({
  value,
  label: value,
}));

export default function IssuesPage() {
  const { data: issues, isLoading } = useTableData("issues");
  const { data: projects } = useTableData("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    description: "",
    status: "Open",
    priority: "High",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("issues", {
        title: formData.title,
        project_id: formData.project_id,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        reported_date: new Date().toISOString(),
      });

      setFormData({
        title: "",
        project_id: "",
        description: "",
        status: "Open",
        priority: "High",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Issues"
        description="Track and manage project issues"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Issue
          </button>
        }
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <EmptyState
          icon={<AlertCircle size={48} className="text-slate-400" />}
          title="No issues yet"
          description="Track issues as they arise during the project"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report Issue
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
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Project
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Priority
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Assigned To
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Reported Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const project = projects.find((p) => p.id === issue.project_id);

                  return (
                    <tr
                      key={issue.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{issue.title}</p>
                        {issue.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {issue.description.substring(0, 50)}...
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {project?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <PriorityDot priority={issue.priority} />
                          <span className="text-sm font-medium text-slate-600">
                            {issue.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {issue.assigned_to || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {issue.reported_date ? formatDateShort(issue.reported_date) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report New Issue"
        description="Create a new issue to track"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Issue Title" required>
            <Input
              type="text"
              placeholder="Issue title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Project" required>
            <Select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              required
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Detailed description of the issue"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={statusOptions}
              />
            </FormField>
            <FormField label="Priority">
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={priorityOptions}
              />
            </FormField>
          </div>

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
              Report Issue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

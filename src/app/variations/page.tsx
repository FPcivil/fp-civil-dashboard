"use client";

import { useState } from "react";
import { useTableData, insertRow, updateRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { EmptyState } from "@/components/EmptyState";
import { GitBranch, Plus } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { VARIATION_STATUSES } from "@/lib/constants";

const statusOptions = Object.entries(VARIATION_STATUSES).map(([, value]) => ({
  value,
  label: value,
}));

export default function VariationsPage() {
  const { data: variations, isLoading } = useTableData("variations");
  const { data: projects } = useTableData("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    description: "",
    status: "Proposed",
    cost_impact: "",
    timeline_impact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("variations", {
        title: formData.title,
        project_id: formData.project_id,
        description: formData.description || null,
        status: formData.status,
        cost_impact: formData.cost_impact ? parseFloat(formData.cost_impact) : null,
        timeline_impact: formData.timeline_impact ? parseInt(formData.timeline_impact) : null,
      });

      setFormData({
        title: "",
        project_id: "",
        description: "",
        status: "Proposed",
        cost_impact: "",
        timeline_impact: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating variation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Variations"
        description="Manage project variations and change orders"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Variation
          </button>
        }
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading variations...</p>
        </div>
      ) : variations.length === 0 ? (
        <EmptyState
          icon={<GitBranch size={48} className="text-slate-400" />}
          title="No variations yet"
          description="Create your first variation when needed"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Variation
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
                    Cost Impact
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Timeline Impact
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Requested Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {variations.map((variation) => {
                  const project = projects.find((p) => p.id === variation.project_id);

                  return (
                    <tr
                      key={variation.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{variation.title}</p>
                        {variation.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {variation.description.substring(0, 50)}...
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {project?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={variation.status} />
                      </td>
                      <td className="px-6 py-4">
                        {variation.cost_impact !== null ? (
                          <span className={variation.cost_impact > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            {variation.cost_impact > 0 ? "+" : ""}${variation.cost_impact.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {variation.timeline_impact !== null ? (
                          <span className={variation.timeline_impact > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            {variation.timeline_impact > 0 ? "+" : ""}{variation.timeline_impact} days
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {variation.requested_date ? formatDateShort(variation.requested_date) : "-"}
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
        title="Create New Variation"
        description="Add a new variation or change order"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Variation Title" required>
            <Input
              type="text"
              placeholder="Variation title"
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
              placeholder="Variation description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <FormField label="Status">
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cost Impact ($)">
              <Input
                type="number"
                placeholder="0.00"
                value={formData.cost_impact}
                onChange={(e) => setFormData({ ...formData, cost_impact: e.target.value })}
                step="0.01"
              />
            </FormField>
            <FormField label="Timeline Impact (days)">
              <Input
                type="number"
                placeholder="0"
                value={formData.timeline_impact}
                onChange={(e) => setFormData({ ...formData, timeline_impact: e.target.value })}
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
              Create Variation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTableData, insertRow, updateRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { EmptyState } from "@/components/EmptyState";
import { HelpCircle, Plus } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { RFI_STATUSES } from "@/lib/constants";

const statusOptions = Object.entries(RFI_STATUSES).map(([, value]) => ({
  value,
  label: value,
}));

export default function RfisPage() {
  const { data: rfis, isLoading } = useTableData("rfis");
  const { data: projects } = useTableData("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    description: "",
    status: "Submitted",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("rfis", {
        title: formData.title,
        project_id: formData.project_id,
        description: formData.description || null,
        status: formData.status,
        submitted_date: new Date().toISOString(),
      });

      setFormData({
        title: "",
        project_id: "",
        description: "",
        status: "Submitted",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating RFI:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="RFIs"
        description="Manage Requests for Information"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New RFI
          </button>
        }
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading RFIs...</p>
        </div>
      ) : rfis.length === 0 ? (
        <EmptyState
          icon={<HelpCircle size={48} className="text-slate-400" />}
          title="No RFIs yet"
          description="Create your first RFI when you need clarification"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create RFI
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
                    Submitted By
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Submitted Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Response Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rfis.map((rfi) => {
                  const project = projects.find((p) => p.id === rfi.project_id);

                  return (
                    <tr
                      key={rfi.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{rfi.title}</p>
                        {rfi.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {rfi.description.substring(0, 50)}...
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {project?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={rfi.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {rfi.submitted_by || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {rfi.submitted_date ? formatDateShort(rfi.submitted_date) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {rfi.response_date ? formatDateShort(rfi.response_date) : "-"}
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
        title="Create New RFI"
        description="Submit a new Request for Information"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="RFI Title" required>
            <Input
              type="text"
              placeholder="RFI title"
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
              placeholder="Detailed description of the RFI"
              rows={4}
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
              Create RFI
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

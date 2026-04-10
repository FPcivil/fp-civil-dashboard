"use client";

import { useState } from "react";
import { useTableData, insertRow, updateRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityDot } from "@/components/PriorityDot";
import { Modal } from "@/components/Modal";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { EmptyState } from "@/components/EmptyState";
import { CheckSquare, Plus } from "lucide-react";
import { formatDateShort, isOverdue } from "@/lib/utils";
import { TASK_STATUSES, PRIORITIES, CATEGORIES } from "@/lib/constants";

const statusOptions = Object.entries(TASK_STATUSES).map(([, value]) => ({
  value,
  label: value,
}));

const priorityOptions = Object.entries(PRIORITIES).map(([, value]) => ({
  value,
  label: value,
}));

const categoryOptions = Object.entries(CATEGORIES).map(([, value]) => ({
  value,
  label: value,
}));

export default function TasksPage() {
  const { data: tasks, isLoading } = useTableData("tasks");
  const { data: projects } = useTableData("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    category: "General",
    due_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("tasks", {
        title: formData.title,
        project_id: formData.project_id,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        due_date: formData.due_date || null,
      });

      setFormData({
        title: "",
        project_id: "",
        description: "",
        status: "Not Started",
        priority: "Medium",
        category: "General",
        due_date: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "All" && task.status !== filterStatus) return false;
    if (filterPriority !== "All" && task.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Manage project tasks and assignments"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Task
          </button>
        }
      />

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="All">All</option>
            {Object.entries(TASK_STATUSES).map(([, value]) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="All">All</option>
            {Object.entries(PRIORITIES).map(([, value]) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={48} className="text-slate-400" />}
          title="No tasks found"
          description="Create your first task to get started"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Task
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
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.project_id);
                  const overdue = isOverdue(task.due_date);

                  return (
                    <tr
                      key={task.id}
                      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                        overdue ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {task.description.substring(0, 50)}...
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {project?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <PriorityDot priority={task.priority} />
                          <span className="text-sm font-medium text-slate-600">
                            {task.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {task.category || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {task.due_date ? (
                          <span className={overdue ? "text-red-600 font-medium" : "text-slate-600"}>
                            {formatDateShort(task.due_date)}
                            {overdue && <span className="ml-2 text-red-600">⚠️</span>}
                          </span>
                        ) : (
                          "-"
                        )}
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
        title="Create New Task"
        description="Add a new task to your projects"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Task Title" required>
            <Input
              type="text"
              placeholder="Task title"
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
              placeholder="Task description"
              rows={3}
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

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categoryOptions}
              />
            </FormField>
            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

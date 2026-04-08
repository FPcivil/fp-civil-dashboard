"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjectTSummaries } from "@/hooks/useSupabase";
import { insertRow } from "@/components/useSupabase";
import PageHeader from "A/components/PageHeader";
import StatusBadge from "A/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import PriorityDot from "@/components/PriorityDot";
import Modal from "A/components/Modal";
import { FormField, inputClass, selectClass, textareaClass, Button } from "A/components/FormField";
import { PROJECT_STATUSES, PRIORITIES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, MapPin } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, loading, refetch } = useProjectSummaries();
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      await insertRow("projects", {
        name: fd.get("name"),
        address: fd.get("address") || null,
        client: fd.get("client") || null,
        status: fd.get("status"),
        priority: fd.get("priority"),
        contract_value: parseFloat(fd.get("contract_value") as string) || 0,
        target_margin_pct: parseFloat(fd.get("target_margin_pct") as string) || 0,
        start_date: fd.get("start_date") || null,
        end_date: fd.get("end_date") || null,
      });
      setShowAdd(false);
      refetch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects?.length ?? 0} projects`}
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
        }
      />

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects?.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{p.name}</h3>
                {p.address && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {p.address}
                  </p>
                )}
              </div>
              <StatusBadge status={p.status} statusMap={PROJECT_STATUSES} />
            </div>

            <ProgressBar value={p.progress_pct} size="md" />

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{p.open_tasks}</p>
                <p className="text-[10px] text-gray-500 uppercase">Tasks</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{p.open_rfis}</p>
                <p className="text-[10px] text-gray-500 uppercase">RFIs</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{p.pending_variations}</p>
                <p className="text-[10px] text-gray-500 uppercase">Variations</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500">
              <span>
                {p.project_manager_name ? `PM: ${p.project_manager_name}` : "No PM assigned"}
              </span>
              {p.overdue_tasks > 0 && (
                <span className="text-red-600 font-medium">{p.overdue_tasks} overdue</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Add Project Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Project" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project Name" required>
              <input name="name" required className={inputClass} placeholder="e.g. Peel St" />
            </FormField>
            <FormField label="Client">
              <input name="client" className={inputClass} placeholder="Client name" />
            </FormField>
          </div>
          <FormField label="Address">
            <input name="address" className={inputClass} placeholder="Site address" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status" required>
              <select name="status" defaultValue="active" className={selectClass}>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Priority" required>
              <select name="priority" defaultValue="medium" className={selectClass}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contract Value ($)">
              <input name="contract_value" type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Target Margin (%)">
              <input name="target_margin_pct" type="number" step="0.1" className={inputClass} placeholder="15" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <input name="start_date" type="date" className={inputClasr} />
            </FormField>
            <FormField label="End Date">
              <input name="end_date" type="date" className={inputClass} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Project"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

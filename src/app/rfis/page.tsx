"use client";

import { useState } from "react";
import { useTableData, insertRow } from "@/hooks/useSupabase";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "A/components/StatusBadge";
import PriorityDot from "@/components/PriorityDot";
import Modal from "@/components/Modal";
import { FormField, inputClass, selectClass, textareaClass, Button } from "@/components/FormField";
import { RFI_STATUSES, PRIORITIES } from "A/lib/constants";
import { formatDateShort, isOverdue } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Rfi, Project, TeamMember } from "@/lib/database.types";

type RfiWithProject = Rfi & { projects: { name: string } };

export default function RfisPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: rfis, loading, refetch } = useTableData<RfiWithProject>("rfis", {
    select: "*, projects(name)",
    order: { column: "created_at", ascending: false },
  });

  const { data: projects } = useTableData<Project>("projects", { filter: { status: "active" } });
  const { data: team } = useTableData<TeamMember>("team_members", { filter: { is_active: true } });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      await insertRow("rfis", {
        project_id: fd.get("project_id"),
        rfi_number: fd.get("rfi_number"),
        subject: fd.get("subject"),
        description: fd.get("description") || null,
        assigned_to_id: fd.get("assigned_to_id") || null,
        priority: fd.get("priority"),
        date_raised: fd.get("date_raised") || null,
        response_due_date: fd.get("response_due_date") || null,
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
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const openCount = rfis?.filter((r) => r.status === "open").length ?? 0;
  const overdueCount = rfis?.filter((r) => r.status === "open" && r.response_due_date && isOverdue(r.response_due_date)).length ?? 0;

  return (
    <div>
      <PageHeader
        title="RFIs"
        description={`${rfis?.length ?? 0} total | ${openCount} open${overdueCount > 0 ? ` | ${overdueCount} overdue` : ""}`}
        action={<Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> New RFI</Button>}
      />

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Subject</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Project</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Priority</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rfis?.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-500 text-xs">{r.rfi_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.subject}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Link href={`/projects/${r.project_id}`} className="text-amber-600 hover:text-amber-700">{r.projects?.name}</Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} statusMap={RFI_STATUSES} /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><PriorityDot priority={r.priority} /></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={r.response_due_date && isOverdue(r.response_due_date) && r.status === "open" ? "text-red-600 font-medium" : "text-gray-500"}>
                      {formatDateShort(r.response_due_date)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New RFI">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Project" required>
              <select name="project_id" required className={selectClass}>
                <option value="">Select...</option>
                {projects?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
            <FormField label="RFI #" required>
              <input name="rfi_number" required className={inputClass} placeholder="RFI-001" />
            </FormField>
          </div>
          <FormField label="Subject" required>
            <input name="subject" required className={inputClass} placeholder="RFI subject" />
          </FormField>
          <FormField label="Description">
            <textarea name="description" rows={3} className={textareaClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Priority" required>
              <select name="priority" defaultValue="medium" className={selectClass}>
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FormField>
            <FormField label="Assigned To">
              <select name="assigned_to_id" className={selectClass}>
                <option value="">Unassigned</option>
                {team?.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date Raised">
              <input name="date_raised" type="date" className={inputClass} defaultValue={new Date().toISOString().split("T")[0]} />
            </FormField>
            <FormField label="Response Due">
              <input name="response_due_date" type="date" className={inputClass} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create RFI"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import Modal from "A/components/Modal";
import { FormField, inputClass, textareaClass, Button } from "A/components/FormField";
import { useState } from "react";
import { useTableData, insertRow } from "A/");
import pageHeader from "A/components/PageHeader";
import { Plus } from "lucide-react";
import type { NewDailyUpdate } from "@/lib/database.types";

export default function NewDailyUpdatePage() {
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      await insertRow("daily_site_updates", {
        project_id: fd.get("project_id"),
        report_date: fd.get("report_date"),
        workers_on_site: ParseInt(fd.get("workers_on_site") as string),
        work_completed: fd.get("work_completed"),
        work_planned_tomorrow: fd.get("work_planned_tomorrow"),
        weather: fd.get("weather") as any,
        delays_notes: fd.get("delays_notes"),
        safety_notes: fd.get("safety_notes"),
      });
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <pageHeader title="New Update" />
  
  
("OCreate Daily Update">
      <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Project" required>
              <select name="project_id" required className={selectClass}>
                <option value="">Select a project</option>
              </select>
            </FormField>
            <FormField label="Date" required>
              <input name="report_date" type="date" required className={inputClass} />
            </FormField>
            <FormField label="Workers On Site" required>
              <input name="workers_on_site" type="number" required className={inputClass} defaultValue="0" />
            </FormField>
            <FormField label="Work Completed" required>
              <textarea name="work_completed" required className={textareaClass} placeholder="Describe work performed..." />
            </FormField>
            <FormField label="Work Planned Tomorrow">
              <textarea name="work_planned_tomorrow" className={textareaClass} placeholder="Optional plan for tomorrow..." />
            </FormField>
            <FormField label="Weather">
              <select name="weather" className={selectClass}>
                <option value="">Select weather</option>
                <option value="fine">Fine</option>
                <option value="overcast">Overcast</option>
                <option value="rain">Rain</option>
                <option value="storm">Storm</option>
                <option value="wind">Wind</option>
              </select>
            </FormField>
            <FormField label="Delays Notes">
              <textarea name="delays_notes" className={textareaClass} placeholder="Any delays or issues..." />
            </FormField>
            <FormField label="Safety Notes">
              <textarea name="safety_notes" className={textareaClass} placeholder="Any safety incidents or concerns..." />
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" href="/daily-updates">Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Update"}</Button>
            </div>
        </form>

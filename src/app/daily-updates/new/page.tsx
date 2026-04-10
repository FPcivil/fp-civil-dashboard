"use client";

import { useState } from "react";
import { useTableData, insertRow } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { FormField, Input, Textarea, Select, Button } from "@/components/FormField";
import { useRouter } from "next/navigation";
import Link from "next/link";

const weatherOptions = [
  { value: "Sunny", label: "Sunny" },
  { value: "Partly Cloudy", label: "Partly Cloudy" },
  { value: "Cloudy", label: "Cloudy" },
  { value: "Rainy", label: "Rainy" },
  { value: "Windy", label: "Windy" },
  { value: "Foggy", label: "Foggy" },
];

export default function NewDailyUpdatePage() {
  const router = useRouter();
  const { data: projects } = useTableData("projects");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    date: new Date().toISOString().split("T")[0],
    weather: "Sunny",
    site_notes: "",
    workers_on_site: "",
    safety_incidents: false,
    safety_notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertRow("daily_updates", {
        project_id: formData.project_id,
        date: formData.date,
        weather: formData.weather || null,
        site_notes: formData.site_notes || null,
        workers_on_site: formData.workers_on_site ? parseInt(formData.workers_on_site) : null,
        safety_incidents: formData.safety_incidents,
        safety_notes: formData.safety_notes || null,
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating daily update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="New Daily Update"
        description="Record daily site progress and conditions"
        actions={
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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

            <FormField label="Date" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Weather">
              <Select
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                options={weatherOptions}
              />
            </FormField>

            <FormField label="Workers on Site">
              <Input
                type="number"
                placeholder="Number of workers"
                value={formData.workers_on_site}
                onChange={(e) => setFormData({ ...formData, workers_on_site: e.target.value })}
                min="0"
              />
            </FormField>
          </div>

          <FormField label="Site Notes">
            <Textarea
              placeholder="Daily progress, completed work, observations..."
              rows={6}
              value={formData.site_notes}
              onChange={(e) => setFormData({ ...formData, site_notes: e.target.value })}
            />
          </FormField>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Safety</h3>

            <FormField>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.safety_incidents}
                  onChange={(e) =>
                    setFormData({ ...formData, safety_incidents: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="font-medium text-slate-700">
                  Safety incidents occurred today
                </span>
              </label>
            </FormField>

            {formData.safety_incidents && (
              <FormField label="Safety Notes" required>
                <Textarea
                  placeholder="Describe the incident(s)..."
                  rows={4}
                  value={formData.safety_notes}
                  onChange={(e) => setFormData({ ...formData, safety_notes: e.target.value })}
                  required
                />
              </FormField>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Save Daily Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

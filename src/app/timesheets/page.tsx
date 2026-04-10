"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

interface Timesheet {
  id: string;
  project_id: string;
  date: string;
  hours: number;
  description: string;
  status: string;
  hourly_rate: number;
  total_cost: number;
  created_at: string;
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ project_id: "", date: new Date().toISOString().split("T")[0], hours: "", description: "", hourly_rate: "" });

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
  }, []);

  async function fetchTimesheets() {
    const { data } = await supabase.from("timesheets").select("*").order("date", { ascending: false });
    setTimesheets(data || []);
    setLoading(false);
  }

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("id, name");
    setProjects(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("timesheets").insert({
      project_id: form.project_id,
      date: form.date,
      hours: parseFloat(form.hours),
      description: form.description,
      hourly_rate: parseFloat(form.hourly_rate) || 0,
      status: "pending",
    });
    setShowForm(false);
    setForm({ project_id: "", date: new Date().toISOString().split("T")[0], hours: "", description: "", hourly_rate: "" });
    fetchTimesheets();
  }

  const totalHours = timesheets.reduce((sum, t) => sum + (t.hours || 0), 0);
  const totalCost = timesheets.reduce((sum, t) => sum + (t.total_cost || 0), 0);
  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || "—";

  if (loading) return <div className="p-8 text-gray-500">Loading timesheets...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Timesheets" subtitle="Track hours across all projects" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Entries</p>
          <p className="text-2xl font-bold text-gray-900">{timesheets.length}</p>
        </div>
      </div>

      <div className="mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
          {showForm ? "Cancel" : "+ Log Hours"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 mb-6 grid grid-cols-2 gap-4">
          <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} required className="border rounded p-2">
            <option value="">Select Project</option>
            {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border rounded p-2" />
          <input type="number" step="0.5" placeholder="Hours" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} required className="border rounded p-2" />
          <input type="number" step="0.01" placeholder="Hourly Rate ($)" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} className="border rounded p-2" />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded p-2 col-span-2" />
          <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded col-span-2">Submit</button>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Date</th>
              <th className="text-left p-3 font-medium text-gray-600">Project</th>
              <th className="text-left p-3 font-medium text-gray-600">Description</th>
              <th className="text-right p-3 font-medium text-gray-600">Hours</th>
              <th className="text-right p-3 font-medium text-gray-600">Rate</th>
              <th className="text-right p-3 font-medium text-gray-600">Total</th>
              <th className="text-center p-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.date}</td>
                <td className="p-3 font-medium">{getProjectName(t.project_id)}</td>
                <td className="p-3 text-gray-600">{t.description || "—"}</td>
                <td className="p-3 text-right">{t.hours}</td>
                <td className="p-3 text-right">${t.hourly_rate || 0}</td>
                <td className="p-3 text-right font-medium">${(t.total_cost || 0).toLocaleString()}</td>
                <td className="p-3 text-center"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
            {timesheets.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No timesheet entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

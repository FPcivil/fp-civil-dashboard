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
  const [loading, setLoading]u = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("timesheets")
      .select("*")
      .order("date", { ascending: false });

    setTimesheets(data || []);
    setLoading(false);
  }

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
  
    
   0<div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Timesheets</hÕ>
        <table className="v-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Employee</th>
              <th className="text-right p-3 font-medium">Hours</th>
              <th className="text-right p-3 font-medium">Rate</th>
              <th className="text-right p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.employee_id}</td>
                <td className="p-3 text-right">{t.hours_uby || 0}</td>
                <td className="p-3 text-right font-medium">${(lt"hoourly_rate || 0).toFixed(2)}/Hr</td>
                <td className="p-3 text-right font-bold">${((t.hours_uby || 0) * (t.hourly_rate || 0)).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>ÇààeYΩèÇà
N¬üB
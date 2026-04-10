"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";

export default function DailyUpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [uRes, pRes] = await Promise.all([
      supabase.from("daily_site_updates").select("*").order("date", { ascending: false }),
      supabase.from("projects").select("id, name"),
    ]);
    setUpdates(uRes.data || []);
    setProjects(pRes.data || []);
    setLoading(false);
  }

  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || "—";

  if (loading) return <div className="p-8 text-gray-500">Loading daily updates...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Daily Updates" subtitle="Site progress and activity reports" />

      <div className="mb-4 flex justify-end">
        <Link href="/daily-updates/new" className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
          + New Update
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Date</th>
              <th className="text-left p-3 font-medium text-gray-600">Project</th>
              <th className="text-left p-3 font-medium text-gray-600">Weather</th>
              <th className="text-center p-3 font-medium text-gray-600">Crew</th>
              <th className="text-left p-3 font-medium text-gray-600">Progress Notes</th>
              <th className="text-center p-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.date}</td>
                <td className="p-3 font-medium">{getProjectName(u.project_id)}</td>
                <td className="p-3 capitalize">{u.weather || "—"}</td>
                <td className="p-3 text-center">{u.crew_count || "—"}</td>
                <td className="p-3 text-gray-600 max-w-xs truncate">{u.progress_notes || "—"}</td>
                <td className="p-3 text-center"><StatusBadge status={u.status || "submitted"} /></td>
              </tr>
            ))}
            {updates.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No daily updates yet. Click "+ New Update" to add one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

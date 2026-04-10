"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";

const PIPELINE_TARGET = 10000000; // $10M

const STAGES = [
  { key: "lead", label: "Lead", color: "bg-gray-400" },
  { key: "quoting", label: "Quoting", color: "bg-blue-400" },
  { key: "submitted", label: "Submitted", color: "bg-amber-400" },
  { key: "won", label: "Won", color: "bg-green-500" },
  { key: "lost", label: "Lost", color: "bg-red-400" },
];

export default function PipelinePage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [qRes, pRes] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*"),
    ]);
    setQuotes(qRes.data || []);
    setProjects(pRes.data || []);
    setLoading(false);
  }

  // Calculate pipeline values
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "in_progress");
  const wonValue = activeProjects.reduce((s, p) => s + (p.contract_value || 0), 0);
  const quotedValue = quotes.filter((q) => q.status === "submitted" || q.status === "quoting").reduce((s, q) => s + (q.value || q.amount || 0), 0);
  const totalPipeline = wonValue + quotedValue;
  const pipelinePercent = Math.min(100, (totalPipeline / PIPELINE_TARGET) * 100);

  const stageData = STAGES.map((stage) => {
    const stageQuotes = quotes.filter((q) => q.status === stage.key);
    return {
      ...stage,
      count: stageQuotes.length,
      value: stageQuotes.reduce((s, q) => s + (q.value || q.amount || 0), 0),
    };
  });

  if (loading) return <div className="p-8 text-gray-500">Loading pipeline...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="$10M Pipeline" subtitle="Revenue pipeline tracker and forecast" />

      {/* Main progress bar */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Annual Revenue Target</h3>
          <span className="text-2xl font-bold text-red-700">${(totalPipeline / 1000000).toFixed(2)}M / $10M</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${pipelinePercent}%` }}>
            {pipelinePercent.toFixed(0)}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Won: ${(wonValue / 1000000).toFixed(2)}M</span>
          <span>Quoted: ${(quotedValue / 1000000).toFixed(2)}M</span>
          <span>Gap: ${(Math.max(0, PIPELINE_TARGET - totalPipeline) / 1000000).toFixed(2)}M</span>
        </div>
      </div>

      {/* Pipeline metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {stageData.map((stage) => (
          <div key={stage.key} className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <span className="text-sm font-medium text-gray-600">{stage.label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stage.count}</p>
            <p className="text-sm text-gray-500">${(stage.value / 1000).toFixed(0)}k</p>
          </div>
        ))}
      </div>

      {/* Active projects contributing to pipeline */}
      <h3 className="font-semibold text-gray-900 mb-3">Active Projects</h3>
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Project</th>
              <th className="text-right p-3 font-medium text-gray-600">Contract Value</th>
              <th className="text-right p-3 font-medium text-gray-600">Estimated Cost</th>
              <th className="text-right p-3 font-medium text-gray-600">Actual Cost</th>
              <th className="text-right p-3 font-medium text-gray-600">Margin</th>
              <th className="text-left p-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const margin = p.contract_value > 0 ? ((p.contract_value - (p.actual_cost || 0)) / p.contract_value * 100) : 0;
              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-right">${(p.contract_value || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">${(p.estimated_cost || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">${(p.actual_cost || 0).toLocaleString()}</td>
                  <td className={`p-3 text-right font-medium ${margin >= 20 ? "text-green-600" : margin >= 10 ? "text-amber-600" : "text-red-600"}`}>
                    {margin.toFixed(1)}%
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === "active" || p.status === "in_progress" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quotes list */}
      <h3 className="font-semibold text-gray-900 mb-3">Quotes in Pipeline</h3>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Quote</th>
              <th className="text-right p-3 font-medium text-gray-600">Value</th>
              <th className="text-left p-3 font-medium text-gray-600">Client</th>
              <th className="text-center p-3 font-medium text-gray-600">Stage</th>
              <th className="text-left p-3 font-medium text-gray-600">Created</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const stageInfo = STAGES.find((s) => s.key === q.status) || STAGES[0];
              return (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{q.title || q.quote_number || q.id.slice(0, 8)}</td>
                  <td className="p-3 text-right font-medium">${(q.value || q.amount || 0).toLocaleString()}</td>
                  <td className="p-3">{q.client || "—"}</td>
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${stageInfo.color}`}></span>
                      <span className="text-xs">{stageInfo.label}</span>
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{q.created_at?.split("T")[0]}</td>
                </tr>
              );
            })}
            {quotes.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No quotes in pipeline</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

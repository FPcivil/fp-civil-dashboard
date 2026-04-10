"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";

export default function CostIntelligencePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [costActuals, setCostActuals] = useState<any[]>([]);
  const [kpiTargets, setKpiTargets] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "benchmarks" | "kpis">("overview");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [projRes, costRes, kpiRes, benchRes] = await Promise.all([
      supabase.from("projects").select("*"),
      supabase.from("cost_actuals").select("*").order("date", { ascending: false }),
      supabase.from("kpi_targets").select("*").eq("is_active", true),
      supabase.from("pricing_benchmarks").select("*").order("category"),
    ]);
    setProjects(projRes.data || []);
    setCostActuals(costRes.data || []);
    setKpiTargets(kpiRes.data || []);
    setBenchmarks(benchRes.data || []);
    setLoading(false);
  }

  const totalContractValue = projects.reduce((s, p) => s + (p.contract_value || 0), 0);
  const totalActualCost = costActuals.reduce((s, c) => s + (c.amount || 0), 0);
  const totalEstimatedCost = projects.reduce((s, p) => s + (p.estimated_cost || 0), 0);
  const overallMargin = totalContractValue > 0 ? ((totalContractValue - totalActualCost) / totalContractValue * 100) : 0;

  const costByCategory = ["labour", "plant", "materials", "subcontractor", "overhead", "other"].map((cat) => ({
    category: cat,
    total: costActuals.filter((c) => c.category === cat).reduce((s, c) => s + (c.amount || 0), 0),
  }));

  if (loading) return <div className="p-8 text-gray-500">Loading cost intelligence...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Cost Intelligence" subtitle="Pricing benchmarks, KPI targets, and cost tracking" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Contract Value</p>
          <p className="text-2xl font-bold text-gray-900">${(totalContractValue / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Actual Costs</p>
          <p className="text-2xl font-bold text-gray-900">${(totalActualCost / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Estimated Costs</p>
          <p className="text-2xl font-bold text-gray-900">${(totalEstimatedCost / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Overall Margin</p>
          <p className={`text-2xl font-bold ${overallMargin >= 20 ? "text-green-600" : overallMargin >= 10 ? "text-amber-600" : "text-red-600"}`}>
            {overallMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["overview", "benchmarks", "kpis"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700"}`}>
            {tab === "overview" ? "Cost Overview" : tab === "benchmarks" ? "Pricing Benchmarks" : "KPI Targets"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Cost by Category</h3>
            {costByCategory.map((c) => (
              <div key={c.category} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-sm capitalize text-gray-700">{c.category}</span>
                <span className="font-medium">${c.total.toLocaleString()}</span>
              </div>
            ))}
            {costActuals.length === 0 && <p className="text-gray-400 text-sm">No cost data recorded yet</p>}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Project Margins</h3>
            {projects.map((p) => {
              const projCosts = costActuals.filter((c) => c.project_id === p.id).reduce((s, c) => s + (c.amount || 0), 0);
              const margin = p.contract_value > 0 ? ((p.contract_value - projCosts) / p.contract_value * 100) : 0;
              return (
                <div key={p.id} className="py-2 border-b last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className={`text-sm font-medium ${margin >= 20 ? "text-green-600" : margin >= 10 ? "text-amber-600" : "text-red-600"}`}>
                      {margin.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={Math.max(0, Math.min(100, margin))} max={100} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "benchmarks" && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600">Item</th>
                <th className="text-left p-3 font-medium text-gray-600">Category</th>
                <th className="text-center p-3 font-medium text-gray-600">Unit</th>
                <th className="text-right p-3 font-medium text-gray-600">Low</th>
                <th className="text-right p-3 font-medium text-gray-600">Average</th>
                <th className="text-right p-3 font-medium text-gray-600">High</th>
                <th className="text-left p-3 font-medium text-gray-600">Region</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{b.item_name}</td>
                  <td className="p-3">{b.category}</td>
                  <td className="p-3 text-center">{b.unit}</td>
                  <td className="p-3 text-right">${b.low_rate?.toFixed(2)}</td>
                  <td className="p-3 text-right font-medium">${b.avg_rate?.toFixed(2)}</td>
                  <td className="p-3 text-right">${b.high_rate?.toFixed(2)}</td>
                  <td className="p-3">{b.region}</td>
                </tr>
              ))}
              {benchmarks.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No pricing benchmarks yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "kpis" && (
        <div className="grid grid-cols-1 gap-4">
          {kpiTargets.map((kpi) => (
            <div key={kpi.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{kpi.kpi_name}</h4>
                  <p className="text-sm text-gray-500">{kpi.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-700">
                    {kpi.unit === "dollars" ? `$${(kpi.target_value / 1000000).toFixed(1)}M` : `${kpi.target_value}%`}
                  </p>
                  <p className="text-xs text-gray-400 uppercase">{kpi.period} target</p>
                </div>
              </div>
            </div>
          ))}
          {kpiTargets.length === 0 && <div className="bg-white rounded-lg border p-12 text-center text-gray-400">No KPI targets configured</div>}
        </div>
      )}
    </div>
  );
}

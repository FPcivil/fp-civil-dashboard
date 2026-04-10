"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

type Tab = "ncrs" | "photos" | "dockets";

export default function SiteOperationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ncrs");
  const [ncrs, setNcrs] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [dockets, setDockets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [ncrRes, photoRes, docketRes, projRes] = await Promise.all([
      supabase.from("ncrs").select("*").order("raised_date", { ascending: false }),
      supabase.from("site_photos").select("*").order("taken_date", { ascending: false }),
      supabase.from("dockets").select("*").order("date", { ascending: false }),
      supabase.from("projects").select("id, name"),
    ]);
    setNcrs(ncrRes.data || []);
    setPhotos(photoRes.data || []);
    setDockets(docketRes.data || []);
    setProjects(projRes.data || []);
    setLoading(false);
  }

  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || "\u2014";

  // NCR Form
  const [ncrForm, setNcrForm] = useState({ project_id: "", ncr_number: "", title: "", description: "", severity: "minor" });
  async function handleAddNcr(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("ncrs").insert({ ...ncrForm, status: "open" });
    setShowForm(false);
    setNcrForm({ project_id: "", ncr_number: "", title: "", description: "", severity: "minor" });
    fetchAll();
  }

  // Docket Form
  const [docketForm, setDocketForm] = useState({ project_id: "", docket_number: "", supplier: "", description: "", quantity: "", unit: "", amount: "" });
  async function handleAddDocket(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("dockets").insert({
      ...docketForm,
      quantity: parseFloat(docketForm.quantity) || 0,
      amount: parseFloat(docketForm.amount) || 0,
      status: "received",
    });
    setShowForm(false);
    setDocketForm({ project_id: "", docket_number: "", supplier: "", description: "", quantity: "", unit: "", amount: "" });
    fetchAll();
  }

  if (loading) return <div className="p-8 text-gray-500">Loading site operations...</div>;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "ncrs", label: "NCRs", count: ncrs.length },
    { key: "photos", label: "Site Photos", count: photos.length },
    { key: "dockets", label: "Dockets", count: dockets.length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Site Operations" subtitle="NCRs, site photos, and delivery dockets" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Open NCRs</p>
          <p className="text-2xl font-bold text-red-600">{ncrs.filter((n) => n.status === "open").length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Site Photos</p>
          <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Unverified Dockets</p>
          <p className="text-2xl font-bold text-amber-600">{dockets.filter((d) => d.status === "received").length}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab.key ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700"}`}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {activeTab === "ncrs" && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 mb-4">
            {showForm ? "Cancel" : "+ Raise NCR"}
          </button>
          {showForm && (
            <form onSubmit={handleAddNcr} className="bg-white rounded-lg border p-4 mb-6 grid grid-cols-2 gap-4">
              <select value={ncrForm.project_id} onChange={(e) => setNcrForm({ ...ncrForm, project_id: e.target.value })} required className="border rounded p-2">
                <option value="">Select Project</option>
                {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <input type="text" placeholder="NCR Number (e.g. NCR-001)" value={ncrForm.ncr_number} onChange={(e) => setNcrForm({ ...ncrForm, ncr_number: e.target.value })} required className="border rounded p-2" />
              <input type="text" placeholder="Title" value={ncrForm.title} onChange={(e) => setNcrForm({ ...ncrForm, title: e.target.value })} required className="border rounded p-2" />
              <select value={ncrForm.severity} onChange={(e) => setNcrForm({ ...ncrForm, severity: e.target.value })} className="border rounded p-2">
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
              <textarea placeholder="Description" value={ncrForm.description} onChange={(e) => setNcrForm({ ...ncrForm, description: e.target.value })} className="border rounded p-2 col-span-2" />
              <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded col-span-2">Submit NCR</button>
            </form>
          )}
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">NCR #</th>
                  <th className="text-left p-3 font-medium text-gray-600">Project</th>
                  <th className="text-left p-3 font-medium text-gray-600">Title</th>
                  <th className="text-center p-3 font-medium text-gray-600">Severity</th>
                  <th className="text-center p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {ncrs.map((n) => (
                  <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono font-medium">{n.ncr_number}</td>
                    <td className="p-3">{getProjectName(n.project_id)}</td>
                    <td className="p-3">{n.title}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${n.severity === "critical" ? "bg-red-100 text-red-700" : n.severity === "major" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {n.severity}
                      </span>
                    </td>
                    <td className="p-3 text-center"><StatusBadge status={n.status} /></td>
                    <td className="p-3">{n.raised_date}</td>
                  </tr>
                ))}
                {ncrs.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No NCRs raised</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "photos" && (
        <div>
          {photos.length === 0 ? (
            <div className="bg-white rounded-lg border p-12 text-center text-gray-400">No site photos uploaded yet</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="bg-white rounded-lg border overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    {p.photo_url ? <img src={p.photo_url} alt={p.caption} className="w-full h-full object-cover" /> : "No image"}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{p.caption || "Untitled"}</p>
                    <p className="text-xs text-gray-500">{getProjectName(p.project_id)} \u00B7 {p.taken_date}</p>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs mt-1 inline-block">{p.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "dockets" && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 mb-4">
            {showForm ? "Cancel" : "+ New Docket"}
          </button>
          {showForm && (
            <form onSubmit={handleAddDocket} className="bg-white rounded-lg border p-4 mb-6 grid grid-cols-2 gap-4">
              <select value={docketForm.project_id} onChange={(e) => setDocketForm({ ...docketForm, project_id: e.target.value })} required className="border rounded p-2">
                <option value="">Select Project</option>
                {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <input type="text" placeholder="Docket Number" value={docketForm.docket_number} onChange={(e) => setDocketForm({ ...docketForm, docket_number: e.target.value })} required className="border rounded p-2" />
              <input type="text" placeholder="Supplier" value={docketForm.supplier} onChange={(e) => setDocketForm({ ...docketForm, supplier: e.target.value })} required className="border rounded p-2" />
              <input type="text" placeholder="Description" value={docketForm.description} onChange={(e) => setDocketForm({ ...docketForm, description: e.target.value })} className="border rounded p-2" />
              <input type="number" step="0.01" placeholder="Quantity" value={docketForm.quantity} onChange={(e) => setDocketForm({ ...docketForm, quantity: e.target.value })} className="border rounded p-2" />
              <input type="text" placeholder="Unit" value={docketForm.unit} onChange={(e) => setDocketForm({ ...docketForm, unit: e.target.value })} className="border rounded p-2" />
              <input type="number" step="0.01" placeholder="Amount ($)" value={docketForm.amount} onChange={(e) => setDocketForm({ ...docketForm, amount: e.target.value })} className="border rounded p-2" />
              <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Submit Docket</button>
            </form>
          )}
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Docket #</th>
                  <th className="text-left p-3 font-medium text-gray-600">Project</th>
                  <th className="text-left p-3 font-medium text-gray-600">Supplier</th>
                  <th className="text-left p-3 font-medium text-gray-600">Description</th>
                  <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                  <th className="text-right p-3 font-medium text-gray-600">Amount</th>
                  <th className="text-center p-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {dockets.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono font-medium">{d.docket_number}</td>
                    <td className="p-3">{getProjectName(d.project_id)}</td>
                    <td className="p-3">{d.supplier}</td>
                    <td className="p-3 text-gray-600">{d.description || "\u2014"}</td>
                    <td className="p-3 text-right">{d.quantity} {d.unit}</td>
                    <td className="p-3 text-right font-medium">${(d.amount || 0).toLocaleString()}</td>
                    <td className="p-3 text-center"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
                {dockets.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No dockets recorded</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

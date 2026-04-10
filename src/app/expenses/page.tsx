"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

interface Expense {
  id: string;
  project_id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  supplier: string;
  po_number: string;
  status: string;
}

const CATEGORIES = ["materials", "equipment", "subcontractor", "fuel", "other"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ project_id: "", date: new Date().toISOString().split("T")[0], category: "materials", description: "", amount: "", supplier: "", po_number: "" });

  useEffect(() => { fetchExpenses(); fetchProjects(); }, []);

  async function fetchExpenses() {
    const { data } = await supabase.from("expenses").select("*").order("date", { ascending: false });
    setExpenses(data || []);
    setLoading(false);
  }

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("id, name");
    setProjects(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("expenses").insert({
      project_id: form.project_id,
      date: form.date,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      supplier: form.supplier,
      po_number: form.po_number,
      status: "pending",
    });
    setShowForm(false);
    setForm({ project_id: "", date: new Date().toISOString().split("T")[0], category: "materials", description: "", amount: "", supplier: "", po_number: "" });
    fetchExpenses();
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || "—";

  if (loading) return <div className="p-8 text-gray-500">Loading expenses...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Expenses" subtitle="Track project costs and purchases" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600">{expenses.filter((e) => e.status === "pending").length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
        </div>
      </div>

      <div className="mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
          {showForm ? "Cancel" : "+ New Expense"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 mb-6 grid grid-cols-2 gap-4">
          <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} required className="border rounded p-2">
            <option value="">Select Project</option>
            {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded p-2">
            {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border rounded p-2" />
          <input type="number" step="0.01" placeholder="Amount ($)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="border rounded p-2" />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="border rounded p-2" />
          <input type="text" placeholder="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="border rounded p-2" />
          <input type="text" placeholder="PO Number" value={form.po_number} onChange={(e) => setForm({ ...form, po_number: e.target.value })} className="border rounded p-2" />
          <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Submit</button>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Date</th>
              <th className="text-left p-3 font-medium text-gray-600">Project</th>
              <th className="text-left p-3 font-medium text-gray-600">Category</th>
              <th className="text-left p-3 font-medium text-gray-600">Description</th>
              <th className="text-left p-3 font-medium text-gray-600">Supplier</th>
              <th className="text-right p-3 font-medium text-gray-600">Amount</th>
              <th className="text-center p-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{exp.date}</td>
                <td className="p-3 font-medium">{getProjectName(exp.project_id)}</td>
                <td className="p-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{exp.category}</span></td>
                <td className="p-3 text-gray-600">{exp.description}</td>
                <td className="p-3">{exp.supplier || "—"}</td>
                <td className="p-3 text-right font-medium">${exp.amount?.toLocaleString()}</td>
                <td className="p-3 text-center"><StatusBadge status={exp.status} /></td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No expenses recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

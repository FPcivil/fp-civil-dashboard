"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import PageHeader from "@/components/PageHeader";

interface RateCard {
  id: string;
  name: string;
  category: string;
  unit: string;
  unit_rate: number;
  description: string;
  is_active: boolean;
}

interface QuoteLineItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  total: number;
  margin_percent: number;
  sell_rate: number;
}

const CATEGORIES = ["labour", "plant", "materials", "subcontractor"];

export default function EstimatingPage() {
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rates" | "workbench">("rates");
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [form, setForm] = useState({ name: "", category: "labour", unit: "hr", unit_rate: "", description: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [ratesRes, quotesRes] = await Promise.all([
      supabase.from("rate_cards").select("*").order("category"),
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
    ]);
    setRateCards(ratesRes.data || []);
    setQuotes(quotesRes.data || []);
    setLoading(false);
  }

  async function fetchLineItems(quoteId: string) {
    const { data } = await supabase.from("quote_line_items").select("*").eq("quote_id", quoteId).order("sort_order");
    setLineItems(data || []);
  }

  async function handleAddRate(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("rate_cards").insert({
      name: form.name,
      category: form.category,
      unit: form.unit,
      unit_rate: parseFloat(form.unit_rate),
      description: form.description,
    });
    setShowForm(false);
    setForm({ name: "", category: "labour", unit: "hr", unit_rate: "", description: "" });
    fetchData();
  }

  async function addLineFromRate(rate: RateCard) {
    if (!selectedQuote) return alert("Select a quote first");
    await supabase.from("quote_line_items").insert({
      quote_id: selectedQuote,
      rate_card_id: rate.id,
      description: rate.name,
      quantity: 1,
      unit: rate.unit,
      unit_rate: rate.unit_rate,
      margin_percent: 15,
      sell_rate: rate.unit_rate * 1.15,
    });
    fetchLineItems(selectedQuote);
  }

  const groupedRates = CATEGORIES.map((cat) => ({
    category: cat,
    items: rateCards.filter((r) => r.category === cat),
  }));

  if (loading) return <div className="p-8 text-gray-500">Loading estimating...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Estimating" subtitle="Rate cards and quote workbench" />

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("rates")} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "rates" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700"}`}>
          Rate Cards
        </button>
        <button onClick={() => setActiveTab("workbench")} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "workbench" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700"}`}>
          Quote Workbench
        </button>
      </div>

      {activeTab === "rates" && (
        <>
          <div className="mb-4">
            <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
              {showForm ? "Cancel" : "+ New Rate"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddRate} className="bg-white rounded-lg border p-4 mb-6 grid grid-cols-3 gap-4">
              <input type="text" placeholder="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border rounded p-2" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded p-2">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
              </select>
              <input type="text" placeholder="Unit (hr, m3, tonne...)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border rounded p-2" />
              <input type="number" step="0.01" placeholder="Unit Rate ($)" value={form.unit_rate} onChange={(e) => setForm({ ...form, unit_rate: e.target.value })} required className="border rounded p-2" />
              <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded p-2" />
              <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">Add Rate</button>
            </form>
          )}

          {groupedRates.map((group) => (
            <div key={group.category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{group.category}</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">Item</th>
                      <th className="text-left p-3 font-medium text-gray-600">Description</th>
                      <th className="text-center p-3 font-medium text-gray-600">Unit</th>
                      <th className="text-right p-3 font-medium text-gray-600">Rate</th>
                      <th className="text-center p-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((rate) => (
                      <tr key={rate.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{rate.name}</td>
                        <td className="p-3 text-gray-600">{rate.description || "\u2014"}</td>
                        <td className="p-3 text-center">{rate.unit}</td>
                        <td className="p-3 text-right font-medium">${rate.unit_rate.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => addLineFromRate(rate)} className="text-red-700 hover:text-red-900 text-xs font-medium">
                            + Add to Quote
                          </button>
                        </td>
                      </tr>
                    ))}
                    {group.items.length === 0 && (
                      <tr><td colSpan={5} className="p-4 text-center text-gray-400">No rates in this category</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === "workbench" && (
        <div>
          <div className="mb-4">
            <select value={selectedQuote} onChange={(e) => { setSelectedQuote(e.target.value); if (e.target.value) fetchLineItems(e.target.value); }} className="border rounded p-2 w-64">
              <option value="">Select a Quote</option>
              {quotes.map((q) => (<option key={q.id} value={q.id}>{q.title || q.quote_number || q.id.slice(0, 8)}</option>))}
            </select>
          </div>

          {selectedQuote && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">Description</th>
                    <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                    <th className="text-center p-3 font-medium text-gray-600">Unit</th>
                    <th className="text-right p-3 font-medium text-gray-600">Rate</th>
                    <th className="text-right p-3 font-medium text-gray-600">Total</th>
                    <th className="text-right p-3 font-medium text-gray-600">Margin %</th>
                    <th className="text-right p-3 font-medium text-gray-600">Sell Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li) => (
                    <tr key={li.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{li.description}</td>
                      <td className="p-3 text-right">{li.quantity}</td>
                      <td className="p-3 text-center">{li.unit}</td>
                      <td className="p-3 text-right">${li.unit_rate?.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">${li.total?.toFixed(2)}</td>
                      <td className="p-3 text-right">{li.margin_percent}%</td>
                      <td className="p-3 text-right font-medium text-green-700">${li.sell_rate?.toFixed(2)}</td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">No line items \u2014 add from Rate Cards tab</td></tr>
                  )}
                </tbody>
                {lineItems.length > 0 && (
                  <tfoot className="bg-gray-50 border-t font-medium">
                    <tr>
                      <td className="p-3">Total</td>
                      <td colSpan={3}></td>
                      <td className="p-3 text-right">${lineItems.reduce((s, l) => s + (l.total || 0), 0).toFixed(2)}</td>
                      <td></td>
                      <td className="p-3 text-right text-green-700">${lineItems.reduce((s, l) => s + ((l.sell_rate || 0) * (l.quantity || 0)), 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {!selectedQuote && (
            <div className="bg-white rounded-lg border p-12 text-center text-gray-400">
              Select a quote above to start building line items
            </div>
          )}
        </div>
      )}
    </div>
  );
}

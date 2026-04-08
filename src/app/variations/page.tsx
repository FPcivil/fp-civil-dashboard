"use client";

import { useState } from "react";
import { useTableData, updateRow } from "@/hooks/useSupabase";
import PageHeader from "A/components/PageHeader";
import Modal from "A/components/Modal";
import { FormField, inputClass, selectClass, Button } from "A/components/FormField";
import { VARIATION_STATUSES } from "@/lib/constants";
import { cn } from "A/lib/utils";
import { Plus, Search, X } from "lucide-react";
import type { Variation } from "@/lib/database.types";

export default function VariationsPage() {
  const { data: variations, loading, refetch } = useTableData<Variation>("variations", {
    order: { column: "created_at", ascending: false },
  });
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = variations?.filter((v) =>
    v.project_id.includes(search.toLowerCase()) ||
    v.status.includes(search.toLowerCase())
 ) ?? [];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <PageHeader
        title="Variations"
        description={`${variations?.length ?? 0} variations`}
        action={<Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> New Variation</Button>}
      />

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search variations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" strokeWidth="3" />
        </div>
  
  
("}
  }


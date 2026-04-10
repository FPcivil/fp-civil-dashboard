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

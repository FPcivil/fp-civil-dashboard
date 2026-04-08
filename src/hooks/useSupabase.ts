"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/lib/database.types";

type TableName = keyof Database["public"]["Tables"];

export function useTableData<T extends TableName>(
  tableName: T,
  filters?: Record<string, any>
) {
  const [data, setData] = useState<Database["public"]["Tables"][T]["Row"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let query = supabase.from(tableName).select("*");

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        const { data: result, error: err } = await query;

        if (err) throw err;
        setData(result || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, filters]);

  return { data, isLoading, error };
}

export function useDashboardKpis() {
  const [kpis, setKpis] = useState<Database["public"]["Views"]["dashboard_kpis"]["Row"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .from("dashboard_kpis")
          .select("*")
          .single();

        if (err) throw err;
        setKpis(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setKpis(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpis();
  }, []);

  return { kpis, isLoading, error };
}

export function useProjectSummaries() {
  const [projects, setProjects] = useState<Database["public"]["Views"]["project_summaries"]["Row"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .from("project_summaries")
          .select("*")
          .order("name", { ascending: true });

        if (err) throw err;
        setProjects(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}

export function useProjectById(projectId: string | null) {
  const [project, setProject] = useState<Database["public"]["Tables"]["projects"]["Row"] | null>(null);
  const [isLoading, setIsLoading] = useState(!!projectId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (err) throw err;
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, isLoading, error };
}

export async function insertRow<T extends TableName>(
  tableName: T,
  data: Database["public"]["Tables"][T]["Insert"]
) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
    .select();

  if (error) throw error;
  return result;
}

export async function updateRow<T extends TableName>(
  tableName: T,
  id: string,
  data: Database["public"]["Tables"][T]["Update"]
) {
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq("id", id)
    .select();

  if (error) throw error;
  return result;
}

export async function deleteRow<T extends TableName>(
  tableName: T,
  id: string
) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

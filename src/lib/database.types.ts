export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          client: string | null;
          description: string | null;
          status: string;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          client?: string | null;
          description?: string | null;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          client?: string | null;
          description?: string | null;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          category: string | null;
          assigned_to: string | null;
          start_date: string | null;
          due_date: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          category?: string | null;
          assigned_to?: string | null;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          category?: string | null;
          assigned_to?: string | null;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      variations: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          cost_impact: number | null;
          timeline_impact: number | null;
          requested_by: string | null;
          requested_date: string | null;
          approved_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          cost_impact?: number | null;
          timeline_impact?: number | null;
          requested_by?: string | null;
          requested_date?: string | null;
          approved_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          cost_impact?: number | null;
          timeline_impact?: number | null;
          requested_by?: string | null;
          requested_date?: string | null;
          approved_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rfis: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          submitted_by: string | null;
          submitted_date: string | null;
          response_date: string | null;
          response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          submitted_by?: string | null;
          submitted_date?: string | null;
          response_date?: string | null;
          response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          submitted_by?: string | null;
          submitted_date?: string | null;
          response_date?: string | null;
          response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      issues: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          reported_by: string | null;
          reported_date: string | null;
          assigned_to: string | null;
          resolved_date: string | null;
          resolution: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          reported_by?: string | null;
          reported_date?: string | null;
          assigned_to?: string | null;
          resolved_date?: string | null;
          resolution?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          reported_by?: string | null;
          reported_date?: string | null;
          assigned_to?: string | null;
          resolved_date?: string | null;
          resolution?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_updates: {
        Row: {
          id: string;
          project_id: string;
          date: string;
          weather: string | null;
          site_notes: string | null;
          workers_on_site: number | null;
          safety_incidents: boolean;
          safety_notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          date: string;
          weather?: string | null;
          site_notes?: string | null;
          workers_on_site?: number | null;
          safety_incidents?: boolean;
          safety_notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          date?: string;
          weather?: string | null;
          site_notes?: string | null;
          workers_on_site?: number | null;
          safety_incidents?: boolean;
          safety_notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          role?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      dashboard_kpis: {
        Row: {
          total_projects: number | null;
          active_projects: number | null;
          total_tasks: number | null;
          completed_tasks: number | null;
          overdue_tasks: number | null;
          open_issues: number | null;
          pending_rfis: number | null;
        };
      };
      project_summaries: {
        Row: {
          id: string;
          name: string;
          client: string | null;
          status: string;
          start_date: string | null;
          end_date: string | null;
          total_tasks: number | null;
          completed_tasks: number | null;
          progress: number | null;
          open_issues: number | null;
          pending_rfis: number | null;
        };
      };
    };
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

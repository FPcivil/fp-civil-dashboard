'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { format, isToday, isBefore, parseISO, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase'
import {
  Project,
  Task,
  Variation,
  RFI,
  SafetyAction,
  ProjectStatus,
} from '@/types/database'
import { KPICard } from '@/components/ui/KPICard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataTable } from '@/components/ui/DataTable'

interface TaskWithProject extends Task {
  project_name?: string
}

interface DashboardData {
  activeProjects: Project[]
  tasksDueToday: TaskWithProject[]
  overdueTasks: TaskWithProject[]
  openVariations: Variation[]
  openRFIs: RFI[]
  safetyActions: SafetyAction[]
  recentActivity: TaskWithProject[]
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    activeProjects: [],
    tasksDueToday: [],
    overdueTasks: [],
    openVariations: [],
    openRFIs: [],
    safetyActions: [],
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const today = format(new Date(), 'yyyy-MM-dd')

        // Fetch active projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active')

        if (projectsError) throw projectsError

        // Fetch tasks due today
        const { data: todayTasksData, error: todayTasksError } = await supabase
          .from('tasks')
          .select('*, projects(name)')
          .eq('due_date', today)
          .neq('status', 'completed')

        if (todayTasksError) throw todayTasksError

        // Fetch overdue tasks
        const { data: overdueTasksData, error: overdueTasksError } = await supabase
          .from('tasks')
          .select('*, projects(name)')
          .lt('due_date', today)
          .neq('status', 'completed')

        if (overdueTasksError) throw overdueTasksError

        // Fetch open variations
        const { data: variationsData, error: variationsError } = await supabase
          .from('variations')
          .select('*')
          .in('status', ['proposed', 'approved'])

        if (variationsError) throw variationsError

        // Fetch open RFIs
        const { data: rfisData, error: rfisError } = await supabase
          .from('rfis')
          .select('*')
          .eq('status', 'pending')

        if (rfisError) throw rfisError

        // Fetch safety actions
        const { data: safetyData, error: safetyError } = await supabase
          .from('safety_actions')
          .select('*')
          .neq('status', 'completed')

        if (safetyError) throw safetyError

        // Fetch recent activity (last 10 task status changes)
        const { data: recentData, error: recentError } = await supabase
          .from('tasks')
          .select('*, projects(name)')
          .order('updated_at', { ascending: false })
          .limit(10)

        if (recentError) throw recentError

        // Enrich task data with project names
        const enrichTasksWithProjectName = (tasks: any[]) =>
          tasks.map((task) => ({
            ...task,
            project_name: task.projects?.name || 'Unknown Project',
          }))

        setData({
          activeProjects: projectsData || [],
          tasksDueToday: enrichTasksWithProjectName(todayTasksData || []),
          overdueTasks: enrichTasksWithProjectName(overdueTasksData || []),
          openVariations: variationsData || [],
          openRFIs: rfisData || [],
          safetyActions: safetyData || [],
          recentActivity: enrichTasksWithProjectName(recentData || []),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateProjectCompletion = (project: Project): number => {
    if (!project.budget) return 0
    return Math.round(((project.spent || 0) / project.budget) * 100)
  }

  const calculateMargin = (project: Project): number => {
    if (!project.budget) return 0
    const spent = project.spent || 0
    return Math.round(((project.budget - spent) / project.budget) * 100)
  }

  const getMarginColor = (margin: number): string => {
    if (margin >= 30) return 'text-green-600'
    if (margin >= 25) return 'text-amber-500'
    if (margin >= 22) return 'text-orange-500'
    return 'text-red-600'
  }

  const getMarginLabel = (margin: number): string => {
    if (margin >= 30) return 'green'
    if (margin >= 25) return 'amber'
    if (margin >= 22) return 'orange'
    return 'red'
  }

  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return '$0'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Active Projects"
            value={data.activeProjects.length}
            icon={TrendingUp}
            color="info"
          />
          <KPICard
            title="Tasks Due Today"
            value={data.tasksDueToday.length}
            icon={Clock}
            color={data.tasksDueToday.length > 0 ? 'warning' : 'success'}
          />
          <KPICard
            title="Overdue Items"
            value={data.overdueTasks.length}
            icon={AlertTriangle}
            color={data.overdueTasks.length > 0 ? 'danger' : 'success'}
          />
          <KPICard
            title="Open Variations"
            value={formatCurrency(
              data.openVariations.reduce((sum, v) => sum + (v.cost_impact || 0), 0)
            )}
            icon={FileText}
            color="info"
          />
          <KPICard
            title="Open RFIs"
            value={data.openRFIs.length}
            icon={FileText}
            color="info"
          />
          <KPICard
            title="Safety Actions"
            value={data.safetyActions.length}
            icon={AlertCircle}
            color={data.safetyActions.length > 0 ? 'danger' : 'success'}
          />
        </div>

        {/* Row 2: Project Status Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
          {isLoading ? (
            <SkeletonLoader />
          ) : data.activeProjects.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No Active Projects"
              description="You don't have any active projects at the moment."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.client_name}</p>
                    </div>
                    <StatusBadge
                      status={project.status}
                      variant="project"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {calculateProjectCompletion(project)}%
                        </span>
                      </div>
                      <ProgressBar
                        value={calculateProjectCompletion(project)}
                        size="md"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Contract Value</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Margin</p>
                        <p className={clsx(
                          'font-semibold',
                          getMarginColor(calculateMargin(project))
                        )}>
                          {calculateMargin(project)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-gray-600 mb-1">PM</p>
                        <p className="font-semibold text-gray-900">
                          {project.project_manager}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Target Completion</p>
                        <p className="font-semibold text-gray-900">
                          {project.end_date
                            ? format(parseISO(project.end_date), 'MMM d, yyyy')
                            : 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Urgent Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Urgent Actions</h2>
            {isLoading ? (
              <SkeletonLoader />
            ) : data.overdueTasks.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No Urgent Items"
                description="All tasks are on track!"
              />
            ) : (
              <div className="space-y-3">
                {data.overdueTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {task.project_name}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <StatusBadge
                            status={task.status}
                            variant="task"
                          />
                          <StatusBadge
                            status={task.priority}
                            variant="priority"
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-red-600 font-semibold">
                          {task.due_date
                            ? `Due \${format(parseISO(task.due_date), 'MMM d')}`
                            : 'No due date'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
            {isLoading ? (
              <SkeletonLoader />
            ) : data.tasksDueToday.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No Upcoming Deadlines"
                description="You're all set!"
              />
            ) : (
              <div className="space-y-3">
                {data.tasksDueToday.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {task.project_name}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <StatusBadge
                            status={task.status}
                            variant="task"
                          />
                          <StatusBadge
                            status={task.priority}
                            variant="priority"
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold text-amber-600">
                          {task.due_date
                            ? `Due \${format(parseISO(task.due_date), 'MMM d')}`
                            : 'No due date'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          {isLoading ? (
            <SkeletonLoader />
          ) : data.recentActivity.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No Recent Activity"
              description="Activity will appear here as tasks are updated."
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <DataTable
                columns={[
                  {
                    key: 'title',
                    header: 'Task',
                    render: (value, row) => (
                      <div>
                        <p className="font-semibold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-600">
                          {(row as TaskWithProject).project_name}
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (value) => (
                      <StatusBadge status={value} variant="task" />
                    ),
                  },
                  {
                    key: 'assigned_to',
                    header: 'Assigned To',
                  },
                  {
                    key: 'updated_at',
                    header: 'Last Updated',
                    render: (value) =>
                      value ? format(parseISO(value), 'MMM d, yyyy HH:mm') : '-',
                  },
                ]}
                data={data.recentActivity}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

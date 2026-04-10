"use client";

import { useTableData } from "@/hooks/useSupabase";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TeamPage() {
  const { data: team, isLoading } = useTableData("team_members");

  return (
    <div>
      <PageHeader
        title="Team"
        description="View team members and contacts"
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading team members...</p>
        </div>
      ) : team.length === 0 ? (
        <EmptyState
          icon={<Users size={48} className="text-slate-400" />}
          title="No team members"
          description="Team members will appear here"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm text-slate-600 mt-1">{member.role}</p>
                  )}
                </div>
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  member.active ? "bg-green-500" : "bg-slate-400"
                )} />
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-600">Email</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:text-blue-700 break-all"
                  >
                    {member.email}
                  </a>
                </div>

                {member.phone && (
                  <div>
                    <p className="text-slate-600">Phone</p>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Added {formatDate(member.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(
  ...inputs: (string | undefined | false | null)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
